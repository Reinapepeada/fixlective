import * as models from '../models/device-model.model.js';
import { fail, textField, validateBody } from '../middlewares/validation.js';

async function requireModel(operation) {
  try {
    const model = await operation;
    if (model) return model;
  } catch (error) {
    if (error.code !== 'P2025') throw error;
  }
  fail(404, 'No se encontró el modelo de celular.');
}

function validated(body, partial = false) {
  validateBody(body, ['brand', 'name']);
  const data = {};
  for (const [key, label] of [['brand', 'La marca'], ['name', 'El modelo']]) {
    if (!partial || key in body) data[key] = textField(body, key, label, 80, true);
  }
  return data;
}

export async function list(_req, res) {
  const data = await models.findAll();
  res.json({ status: 'ok', data });
}

export async function get(req, res) {
  const data = await requireModel(models.findById(req.params.id));
  res.json({ status: 'ok', data });
}

export async function create(req, res) {
  const data = await models.create(validated(req.body));
  res.status(201).json({ status: 'ok', data });
}

export async function update(req, res) {
  const { id } = req.params;
  await requireModel(models.findById(id));
  const data = await requireModel(models.update(id, validated(req.body, true)));
  res.json({ status: 'ok', data });
}

export async function remove(req, res) {
  try {
    const data = await requireModel(models.remove(req.params.id));
    res.json({ status: 'ok', data });
  } catch (error) {
    if (error.code === 'P2003') fail(409, 'Este modelo tiene casos asociados y no se puede eliminar.');
    throw error;
  }
}
