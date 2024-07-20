import { Router } from 'express';
import ReportController from '../controllers/ReportController.js';
import  AdminAuth  from '../middleware/AdminAuth.js';

const router = Router();
const reportController = new ReportController();

router.get('/:month/:year', AdminAuth, reportController.generateReport);

export default router;