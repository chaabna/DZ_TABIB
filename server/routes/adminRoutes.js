// adminRoutes.js
import express from "express";
const router = express.Router();
import adminFunction from "../controller/adminFunction.js";
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /profile/admin/{userId}:
 *   put:
 *     summary: Update another user's profile (Admin Only)
 *     description: Allows an admin to update another user's profile information.
 *     tags: [Admin]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose profile is to be updated.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: integer
 *                 description: The ID of the admin performing the operation.
 *               username:
 *                 type: string
 *                 description: The new username for the user.
 *               email:
 *                 type: string
 *                 description: The new email for the user.
 *               password_hash:
 *                 type: string
 *                 description: The new password hash for the user.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       401:
 *         description: Unauthorized - Not authorized to perform this operation.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/profile/admin/:userId", adminFunction.updateOtherProfile);

/**
 * @swagger
 * /profile/admin/{userId}:
 *   delete:
 *     summary: Delete another user's profile (Admin Only)
 *     description: Allows an admin to delete another user's profile.
 *     tags: [Admin]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose profile is to be deleted.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: integer
 *                 description: The ID of the admin performing the operation.
 *     responses:
 *       200:
 *         description: Profile deleted successfully.
 *       401:
 *         description: Unauthorized - Not authorized to perform this operation.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/profile/admin/:userId", adminFunction.deleteOtherProfile);

/**
 * @swagger
 * /user/suspend:
 *   post:
 *     summary: Suspend a user (Admin Only)
 *     description: Allows an admin to suspend a user account.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: integer
 *                 description: The ID of the admin performing the operation.
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be suspended.
 *               suspensionReason:
 *                 type: string
 *                 description: The reason for suspending the user.
 *     responses:
 *       200:
 *         description: User suspended successfully.
 *       401:
 *         description: Unauthorized - Only admins can suspend users.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/user/suspend", adminFunction.suspendUser);

/**
 * @swagger
 * /user/unsuspend:
 *   post:
 *     summary: Unsuspend a user (Admin Only)
 *     description: Allows an admin to unsuspend a user account.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: integer
 *                 description: The ID of the admin performing the operation.
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be unsuspended.
 *     responses:
 *       200:
 *         description: User unsuspended successfully.
 *       401:
 *         description: Unauthorized - Only admins can unsuspend users.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/user/unsuspend", adminFunction.unsuspendUser);

export default router;