import express from 'express';
import { verifyRefreshToken } from "../middleware/verifyAccessToken.js";
import { login, requestPasswordReset, resetPassword, signUp, verifyResetCode } from "../controller/auth.js";

const routerAuth = express.Router();

routerAuth.post('/signUp', signUp);
routerAuth.post('/login', login);
routerAuth.get('/refresh', verifyRefreshToken);
routerAuth.post('/requestPasswordReset', requestPasswordReset);
routerAuth.post('/verifyResetCode', verifyResetCode);
routerAuth.post('/resetPassword', resetPassword);

export default routerAuth;