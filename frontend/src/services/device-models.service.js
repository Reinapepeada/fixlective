import axios from 'axios';

const BASE = '/api/device-models';
export const getAll = async (signal) => (await axios.get(BASE, { signal })).data.data;
export const getById = async (id) => (await axios.get(`${BASE}/${id}`)).data.data;
export const create = async (data) => (await axios.post(BASE, data)).data.data;
export const update = async (id, patch) => (await axios.patch(`${BASE}/${id}`, patch)).data.data;
export const remove = async (id) => (await axios.delete(`${BASE}/${id}`)).data.data;
