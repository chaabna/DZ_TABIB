import express from 'express';
import { verifyRefreshToken } from "../middleware/verifyAccessToken.js";
import { login, requestPasswordReset, resetPassword, signUp, verifyResetCode } from "../controller/auth.js";

const routerAuth = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication and password management
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               first_name:
 *                 type: string
 *                 description: The first name of the user.
 *               last_name:
 *                 type: string
 *                 description: The last name of the user.
 *               account_type:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *                 description: The account type of the user.
 *               registration_number:
 *                 type: string
 *                 description: The registration number of the doctor (required if account_type is doctor).
 *               specialty_id:
 *                 type: integer
 *                 description: The specialty ID of the doctor (required if account_type is doctor).
 *               experience_years:
 *                 type: integer
 *                 description: The years of experience of the doctor (required if account_type is doctor).
 *               professional_statement:
 *                 type: string
 *                 description: The professional statement of the doctor (required if account_type is doctor).
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the patient (required if account_type is patient).
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 description: The gender of the patient (required if account_type is patient).
 *               admin_role:
 *                 type: string
 *                 enum: [SuperAdmin, ContentModerator, UserManager, SystemAdmin]
 *                 description: The role of the admin (required if account_type is admin).
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request (e.g., missing fields or email/username already exists).
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
 */
routerAuth.post('/signUp', signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user and return access and refresh tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message.
 *                 accessToken:
 *                   type: string
 *                   description: The access token for the user.
 *       400:
 *         description: Bad request (e.g., missing fields).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *       401:
 *         description: Unauthorized (e.g., invalid email or password).
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
 */
routerAuth.post('/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token
 *     description: Generate a new access token using the refresh token.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *       401:
 *         description: Unauthorized (e.g., invalid or expired refresh token).
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
 */
routerAuth.get('/refresh', verifyRefreshToken);

/**
 * @swagger
 * /auth/requestPasswordReset:
 *   post:
 *     summary: Request a password reset
 *     description: Send a password reset code to the user's email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *     responses:
 *       200:
 *         description: Password reset code sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message.
 *       404:
 *         description: User not found.
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
 */
routerAuth.post('/requestPasswordReset', requestPasswordReset);

/**
 * @swagger
 * /auth/verifyResetCode:
 *   post:
 *     summary: Verify password reset code
 *     description: Verify the password reset code sent to the user's email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               resetCode:
 *                 type: string
 *                 description: The reset code sent to the user's email.
 *     responses:
 *       200:
 *         description: Reset code verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Invalid or expired reset code.
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
 */
routerAuth.post('/verifyResetCode', verifyResetCode);

/**
 * @swagger
 * /auth/resetPassword:
 *   post:
 *     summary: Reset user password
 *     description: Reset the user's password using the verified reset code.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               resetCode:
 *                 type: string
 *                 description: The reset code sent to the user's email.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Invalid or expired reset code.
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
 */
routerAuth.post('/resetPassword', resetPassword);

export default routerAuth;