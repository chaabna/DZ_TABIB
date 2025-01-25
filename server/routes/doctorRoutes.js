import express from 'express';
const router = express.Router();
import doctorController from '../controller/doctorController.js';

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API for managing doctors
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Retrieve a list of all doctors with their details, including average ratings.
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: A list of doctors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 */
router.get('/doctors', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/doctors/{doctorId}:
 *   get:
 *     summary: Get a doctor by ID
 *     description: Retrieve detailed information about a specific doctor, including working hours, languages, and insurance providers.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the doctor to retrieve.
 *     responses:
 *       200:
 *         description: Detailed information about the doctor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorDetails'
 *       404:
 *         description: Doctor not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 */
router.get('/doctors/:doctorId', doctorController.getDoctorById);

/**
 * @swagger
 * /api/doctors/search:
 *   get:
 *     summary: Search for doctors
 *     description: Search for doctors based on filters such as specialty, insurance provider, province, consultation type, and language.
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: integer
 *         description: Filter by specialty ID.
 *       - in: query
 *         name: mutuelleId
 *         schema:
 *           type: integer
 *         description: Filter by insurance provider (mutuelle) ID.
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: integer
 *         description: Filter by province ID.
 *       - in: query
 *         name: consultationTypeId
 *         schema:
 *           type: integer
 *         description: Filter by consultation type ID.
 *       - in: query
 *         name: languageId
 *         schema:
 *           type: integer
 *         description: Filter by language ID.
 *     responses:
 *       200:
 *         description: A list of doctors matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.get('/search', doctorController.searchDoctorsHandler);

export default router;