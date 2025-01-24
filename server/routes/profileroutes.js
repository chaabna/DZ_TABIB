import express from 'express';
const router = express.Router();
import userController from '../controller/userFunctions.js';
// Profile Routes
router.get('/profile/:userId', userController.getProfile);
router.put('/profile/:userId', userController.updateProfile);
router.delete('/profile/:userId', userController.deleteProfile);
router.put('/profile/password/:userId', userController.changePassword);
export default  router;