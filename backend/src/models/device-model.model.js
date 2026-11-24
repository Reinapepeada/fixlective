import { getPrisma } from '../lib/prisma.js';

const select = { id: true, brand: true, name: true };

export function findAll() {
  return getPrisma().deviceModel.findMany({ select, orderBy: { created_order: 'asc' } });
}

export function findById(id) {
  return getPrisma().deviceModel.findUnique({ where: { id }, select });
}

export function create(data) {
  return getPrisma().deviceModel.create({ data, select });
}

export function update(id, data) {
  return getPrisma().deviceModel.update({ where: { id }, data, select });
}

export function remove(id) {
  return getPrisma().deviceModel.delete({ where: { id }, select: { id: true } });
}
