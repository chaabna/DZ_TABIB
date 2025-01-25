import express from 'express';
const router = express.Router();
import userController from '../controller/userFunctions.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 *  /api/profile/{userId}:
 *   get:
 *     summary: Get a user's profile by ID
 *     description: Retrieve a user's profile by their ID, including their first name and last name.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/profile/:userId', userController.getProfile);

/**
 * @swagger
 * /api/profile/{userId}:
 *   put:
 *     summary: Update a user's profile
 *     description: Update a user's profile with the provided data.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileData:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   experience_years:
 *                     type: integer
 *                   education_background:
 *                     type: string
 *                   professional_statement:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address_id:
 *                       type: integer
 *                     street_address:
 *                       type: string
 *                     additional_details:
 *                       type: string
 *                     commune_id:
 *                       type: integer
 *                     is_primary:
 *                       type: boolean
 *               workingHours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     working_hours_id:
 *                       type: integer
 *                     day_of_week:
 *                       type: string
 *                     start_time:
 *                       type: string
 *                       format: time
 *                     end_time:
 *                       type: string
 *                       format: time
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language_id:
 *                       type: integer
 *               mutuelles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mutuelle_id:
 *                       type: integer
 *               profileImage:
 *                 type: string
 *                 description: URL of the profile image.
 *             example:
 *               profileData:
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 email: "john.doe@example.com"
 *                 phone: "1234567890"
 *                 experience_years: 5
 *                 education_background: "MD in Cardiology"
 *                 professional_statement: "Experienced cardiologist."
 *                 date_of_birth: "1980-01-01"
 *                 gender: "M"
 *               addresses:
 *                 - address_id: 1
 *                   street_address: "123 Main St"
 *                   additional_details: "Apt 4B"
 *                   commune_id: 1
 *                   is_primary: true
 *               workingHours:
 *                 - working_hours_id: 1
 *                   day_of_week: "Monday"
 *                   start_time: "09:00:00"
 *                   end_time: "17:00:00"
 *               languages:
 *                 - language_id: 1
 *               mutuelles:
 *                 - mutuelle_id: 1
 *               profileImage: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/profile/:userId', userController.updateProfile);

/**
 * @swagger
 *  /api/profile/{userId}:
 *   delete:
 *     summary: Delete a user's profile by ID
 *     description: Delete a user's profile by their ID.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: Profile deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/profile/:userId', userController.deleteProfile);

/**
 * @swagger
 *   /api/profile/password/{userId}:
 *   put:
 *     summary: Change a user's password
 *     description: Change a user's password by providing the old password and the new password.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *             example:
 *               oldPassword: "oldPassword123"
 *               newPassword: "newPassword123"
 *               confirmNewPassword: "newPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid input data (e.g., passwords do not match, old password is incorrect).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/profile/password/:userId', userController.changePassword);



export default router;