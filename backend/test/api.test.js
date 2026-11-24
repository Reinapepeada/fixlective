import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import app from '../src/app.js';
import { getPrisma } from '../src/lib/prisma.js';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
process.env.DATABASE_URL = testDatabaseUrl ?? '';

async function startApi(t) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  async function request(path, method = 'GET', body) {
    const response = await fetch(base + path, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { code: response.status, ...await response.json() };
  }
  return { base, request };
}

test('health informa que la base de datos no está disponible', {
  skip: Boolean(testDatabaseUrl),
}, async (t) => {
  const { request } = await startApi(t);
  assert.deepEqual(await request('/health'), { code: 503, status: 'error', db: 'unreachable' });
});

test('CRUD relacionado, edición parcial, archivado y validaciones por HTTP', {
  skip: !testDatabaseUrl && 'Configurá TEST_DATABASE_URL con una base de prueba migrada.',
}, async (t) => {
  const { base, request } = await startApi(t);
  const prisma = getPrisma();
  let modelId;
  let itemId;
  t.after(async () => {
    try {
      if (itemId) await prisma.failureCase.deleteMany({ where: { id: itemId } });
      if (modelId) await prisma.deviceModel.deleteMany({ where: { id: modelId } });
    } finally {
      await prisma.$disconnect();
    }
  });

  const modelName = `Modelo ${randomUUID()}`;
  const missingId = `missing-${randomUUID()}`;

  assert.deepEqual(await request('/health'), { code: 200, status: 'ok', db: 'ok' });
  assert.ok(Array.isArray((await request('/device-models')).data));
  assert.equal((await request('/device-models', 'POST', { brand: ' ', name: 'X' })).code, 400);

  const model = await request('/device-models', 'POST', { brand: ' Prueba ', name: modelName });
  if (model.code === 201) modelId = model.data.id;
  assert.equal(model.code, 201);
  const modelPath = `/device-models/${modelId}`;
  assert.deepEqual(model.data, { id: modelId, brand: 'Prueba', name: modelName });
  assert.deepEqual((await request(modelPath)).data, model.data);
  const duplicate = await request('/device-models', 'POST', { brand: 'prueba', name: modelName.toLowerCase() });
  assert.deepEqual(duplicate, {
    code: 409,
    status: 'error',
    data: { message: 'Ya existe un modelo con esa marca y nombre.' },
  });

  assert.equal((await request('/failure-cases', 'POST', { device_model_id: missingId, symptom: 'Prueba' })).code, 400);
  assert.equal((await request('/failure-cases', 'POST', { device_model_id: modelId, symptom: '' })).code, 400);
  const item = await request('/failure-cases', 'POST', { device_model_id: modelId, symptom: 'No carga' });
  if (item.code === 201) itemId = item.data.id;
  assert.equal(item.code, 201);
  assert.deepEqual(item.data, {
    id: itemId,
    device_model_id: modelId,
    symptom: 'No carga',
    diagnosis: '',
    solution: '',
    status: 'active',
  });
  const itemPath = `/failure-cases/${itemId}`;

  const filtered = await request(`/failure-cases?deviceModelId=${modelId}`);
  assert.deepEqual(filtered.data, [item.data]);
  assert.deepEqual((await request(`/failure-cases?deviceModelId=${missingId}`)).data, []);
  assert.equal((await request('/failure-cases?deviceModelId=one&deviceModelId=two')).code, 400);

  const edited = await request(itemPath, 'PATCH', { diagnosis: 'Diagnóstico de prueba', solution: 'Solución de prueba' });
  assert.equal(edited.data.symptom, 'No carga');
  assert.equal(edited.data.solution, 'Solución de prueba');
  assert.equal((await request(itemPath, 'PATCH', { status: 'resolved' })).code, 400);
  assert.equal((await request(itemPath, 'PATCH', { symptom: ' ', diagnosis: 'No guardar' })).code, 400);
  assert.equal((await request(itemPath)).data.diagnosis, 'Diagnóstico de prueba');
  assert.equal((await request(itemPath, 'PATCH', { id: 'overwrite' })).code, 400);
  assert.equal((await request(itemPath, 'PATCH', {})).code, 400);

  assert.equal((await request(itemPath, 'PATCH', { status: 'archived' })).data.status, 'archived');
  assert.deepEqual(await request(modelPath, 'DELETE'), {
    code: 409,
    status: 'error',
    data: { message: 'Este modelo tiene casos asociados y no se puede eliminar.' },
  });
  assert.equal((await request(itemPath, 'PATCH', { status: 'active' })).data.status, 'active');
  assert.equal((await request(modelPath, 'PATCH', { name: 'Modelo corregido' })).data.brand, 'Prueba');
  assert.equal((await request(modelPath)).data.name, 'Modelo corregido');

  assert.equal((await request(itemPath, 'DELETE')).code, 200);
  assert.equal((await request(itemPath)).code, 404);
  assert.equal((await request(modelPath, 'DELETE')).code, 200);
  assert.equal((await request(modelPath)).code, 404);
  assert.equal((await request('/unknown')).code, 404);

  const invalidJson = await fetch(base + '/device-models', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  });
  assert.equal(invalidJson.status, 400);
  assert.match((await invalidJson.json()).data.message, /JSON/);
});
