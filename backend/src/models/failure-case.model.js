import { getPrisma } from '../lib/prisma.js';

const select = {
  id: true,
  device_model_id: true,
  symptom: true,
  diagnosis: true,
  solution: true,
  status: true,
};

export function findAll(deviceModelId) {
  return getPrisma().failureCase.findMany({
    where: deviceModelId ? { device_model_id: deviceModelId } : {},
    select,
    orderBy: { created_order: 'desc' },
  });
}

export function findById(id) {
  return getPrisma().failureCase.findUnique({ where: { id }, select });
}

export async function hasModel(id) {
  const item = await getPrisma().failureCase.findFirst({
    where: { device_model_id: id },
    select: { id: true },
  });
  return item !== null;
}

export function create(data) {
  return getPrisma().failureCase.create({ data, select });
}

export function update(id, data) {
  return getPrisma().failureCase.update({ where: { id }, data, select });
}

export function remove(id) {
  return getPrisma().failureCase.delete({ where: { id }, select: { id: true } });
}
