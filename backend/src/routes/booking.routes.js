import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';

const router = Router();

router.get('/home', BookingController.getHomeSections);

export default router;
