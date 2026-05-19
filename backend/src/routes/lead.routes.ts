import { Router } from 'express';
import { leadController } from '../controllers/lead.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
} from '../validations/lead.validation';

const router = Router();

router.use(authenticate);

router.get('/stats', leadController.getStats.bind(leadController));

router.get(
  '/export/csv',
  authorize('admin'),
  validate(leadQuerySchema.omit({ page: true, limit: true }), 'query'),
  leadController.exportCsv.bind(leadController)
);

router.get(
  '/',
  validate(leadQuerySchema, 'query'),
  leadController.getLeads.bind(leadController)
);

router.get('/:id', leadController.getLeadById.bind(leadController));

router.post(
  '/',
  validate(createLeadSchema),
  leadController.createLead.bind(leadController)
);

router.put(
  '/:id',
  validate(updateLeadSchema),
  leadController.updateLead.bind(leadController)
);

router.delete(
  '/:id',
  authorize('admin'),
  leadController.deleteLead.bind(leadController)
);

export default router;
