import UserModel from '../models/UserModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    secure: true,
});

const signUp = async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.username || !userData.email || !userData.password || 
            !userData.first_name || !userData.last_name || !userData.account_type) {
            return res.status(400).json({ msg: 'Please fill all required fields' });
        }

        const existingUser = await UserModel.findByEmail(userData.email);
        if (existingUser) {
            return res.status(400).json({ msg: 'Email or username already exists' });
        }

        const result = await UserModel.createUser(userData);
        res.status(201).json({ msg: result.message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please fill all the fields' });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isValid = await UserModel.verifyPassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        const additionalInfo = await UserModel.getAdditionalInfo(user.user_id, user.account_type);
        const tokenData = { 
            userId: user.user_id, 
            accountType: user.account_type,
            ...additionalInfo
        };

        const { accessToken, refreshToken } = UserModel.generateTokens(tokenData);

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/"
        });

        res.cookie('accesstoken', accessToken, {
            maxAge: 1 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/"
        });

        res.status(200).json({ msg: 'Login successful', accessToken });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        await UserModel.storeResetToken(email, resetCode);

        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Password Reset Code',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Password Reset Request</h2>
                    <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                    <p>Your password reset code is:</p>
                    <h1 style="color: #2e6da4;">${resetCode}</h1>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Recovery email sent' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const verifyResetCode = async (req, res) => {
    try {
        const { email, resetCode } = req.body;
        const isValid = await UserModel.verifyResetToken(email, resetCode);

        if (!isValid) {
            return res.status(400).json({ msg: 'Invalid or expired reset code' });
        }

        res.status(200).json({ msg: 'Code verified successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        const isValid = await UserModel.verifyResetToken(email, resetCode);

        if (!isValid) {
            return res.status(400).json({ msg: 'Invalid or expired reset code' });
        }

        await UserModel.updatePassword(email, newPassword);

        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Your password has been changed',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Password Changed Successfully</h2>
                    <p>Hello,</p>
                    <p>This is a confirmation that the password for your account <strong>${email}</strong> has just been changed.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export { signUp, login, requestPasswordReset, verifyResetCode, resetPassword };