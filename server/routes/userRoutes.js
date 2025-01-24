// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import userController from '../controller/userFunctions.js';
// User Routes
router.get('/user/:userId', userController.getUser);
router.get('/patients', userController.getAllpatient); 
// router.get('/doctors', userController.getAlldoctores);
router.get('/search', userController.searchUsers);


export default  router;