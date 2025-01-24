// routes/appointments.js
import express from 'express';
import {
    getAllAppointments,
    createAppointment,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from '../controller/appointmentController.js';

const router = express.Router();

// Define routes
/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointments management
 */
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Retrieve a list of all appointments.
 *     tags: [Appointments]
 * 
 *     responses:
 *       200:
 *         description: A list of appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   appointment_id:
 *                     type: integer
 *                   doctor_id:
 *                     type: integer
 *                   patient_id:
 *                     type: integer
 *                   appointment_date:
 *                     type: string
 *                     format: date
 *                   appointment_time:
 *                     type: string
 *                     format: time
 *                   consultation_type_id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   medical_certificate_required:
 *                     type: boolean
 *       500:
 *         description: Internal server error.
 */
router.get('/', getAllAppointments);
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     description: Create a new appointment with the provided details.
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *                 description: The ID of the doctor.
 *               patient_id:
 *                 type: integer
 *                 description: The ID of the patient.
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 description: The date of the appointment (YYYY-MM-DD).
 *               appointment_time:
 *                 type: string
 *                 format: time
 *                 description: The time of the appointment (HH:MM:SS).
 *               consultation_type_id:
 *                 type: integer
 *                 description: The ID of the consultation type.
 *               status:
 *                 type: string
 *                 description: The status of the appointment.
 *               notes:
 *                 type: string
 *                 description: Additional notes for the appointment.
 *               medical_certificate_required:
 *                 type: boolean
 *                 description: Whether a medical certificate is required.
 *             example:
 *               doctor_id: 1
 *               patient_id: 1
 *               appointment_date: "2023-12-01"
 *               appointment_time: "10:00:00"
 *               consultation_type_id: 1
 *               status: "En attente"
 *               notes: "Routine checkup"
 *               medical_certificate_required: false
 *     responses:
 *       201:
 *         description: Appointment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created appointment.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/', createAppointment);
/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     description: Retrieve an appointment by its ID.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the appointment.
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointment_id:
 *                   type: integer
 *                 doctor_id:
 *                   type: integer
 *                 patient_id:
 *                   type: integer
 *                 appointment_date:
 *                   type: string
 *                   format: date
 *                 appointment_time:
 *                   type: string
 *                   format: time
 *                 consultation_type_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 medical_certificate_required:
 *                   type: boolean
 *       404:
 *         description: Appointment not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', getAppointmentById);
/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     description: Update an existing appointment by its ID.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the appointment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_date:
 *                 type: string
 *                 format: date
 *               appointment_time:
 *                 type: string
 *                 format: time
 *               consultation_type_id:
 *                 type: integer
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *               medical_certificate_required:
 *                 type: boolean
 *             example:
 *               appointment_date: "2023-12-02"
 *               appointment_time: "11:00:00"
 *               consultation_type_id: 2
 *               status: "Confirmé"
 *               notes: "Follow-up completed"
 *               medical_certificate_required: true
 *     responses:
 *       200:
 *         description: Appointment updated successfully.
 *       404:
 *         description: Appointment not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', updateAppointment);
/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     description: Delete an existing appointment by its ID.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the appointment to delete.
 *     responses:
 *       200:
 *         description: Appointment deleted successfully.
 *       404:
 *         description: Appointment not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', deleteAppointment);

export default router;