import express from 'express';
const router = express.Router();
import doctorController from '../controller/doctorController.js';

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:doctorId', doctorController.getDoctorById);

export default router;