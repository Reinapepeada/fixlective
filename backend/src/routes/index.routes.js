import { Router } from 'express';
import * as deviceModels from '../controllers/device-model.controller.js';
import * as failureCases from '../controllers/failure-case.controller.js';
import { getPrisma } from '../lib/prisma.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
  } catch {
    return res.status(503).json({ status: 'error', db: 'unreachable' });
  }
  res.json({ status: 'ok', db: 'ok' });
});

router.route('/device-models').get(deviceModels.list).post(deviceModels.create);
router.route('/device-models/:id')
  .get(deviceModels.get).patch(deviceModels.update).delete(deviceModels.remove);
router.route('/failure-cases').get(failureCases.list).post(failureCases.create);
router.route('/failure-cases/:id')
  .get(failureCases.get).patch(failureCases.update).delete(failureCases.remove);

export default router;
