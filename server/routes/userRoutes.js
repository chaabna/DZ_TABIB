// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import userController from '../controller/userFunctions.js';
// Profile Routes
router.get('/profile/:userId', userController.getProfile);
router.put('/profile/:userId', userController.updateProfile);
router.delete('/profile/:userId', userController.deleteProfile);

// Admin Routes
router.put('/profile/admin/:userId', userController.updateOtherProfile);
router.delete('/profile/admin/:userId', userController.deleteOtherProfile);

// User Routes
router.get('/user/:userId', userController.getUser);
router.get('/patients', userController.getAllpatient); 
router.get('/doctors', userController.getAlldoctores);
router.get('/search', userController.searchUsers);
router.post('/user/suspend', userController.suspendUser);
router.post('/user/unsuspend',userController. unsuspendUser);

export default  router;