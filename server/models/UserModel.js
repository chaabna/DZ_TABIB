import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/database.js';

class UserModel {
    // Helper method to get database connection
    static async getConnection() {
        return await pool.getConnection();
    }

    // Create new user
    static async createUser(userData) {
        const conn = await this.getConnection();
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            await conn.beginTransaction();
            
            // Insert into Users table
            const [userResult] = await conn.query(
                'INSERT INTO Users (username, email, password_hash, account_type) VALUES (?, ?, ?, ?)',
                [userData.username, userData.email, hashedPassword, userData.account_type]
            );
            
            const userId = userResult.insertId;

            if (userData.account_type === 'doctor') {
                await conn.query(
                    'INSERT INTO Doctors (user_id, first_name, last_name, registration_number, specialty_id, experience_years, professional_statement) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userId, userData.first_name, userData.last_name, userData.registration_number, userData.specialty_id, userData.experience_years, userData.professional_statement]
                );
            } else if (userData.account_type === 'patient') {
                await conn.query(
                    'INSERT INTO Patients (user_id, first_name, last_name, date_of_birth, gender) VALUES (?, ?, ?, ?, ?)',
                    [userId, userData.first_name, userData.last_name, userData.date_of_birth, userData.gender]
                );
            } else if (userData.account_type === 'admin') {
                const admin_role = userData.admin_role || 'UserManager';
                await conn.query(
                    'INSERT INTO Admins (user_id, first_name, last_name, role) VALUES (?, ?, ?, ?)',
                    [userId, userData.first_name, userData.last_name, admin_role]
                );
            }
            
            await conn.commit();
            return { success: true, message: `${userData.account_type} registered successfully`, userId };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const conn = await this.getConnection();
        try {
            const [users] = await conn.query(
                'SELECT user_id, username, email, password_hash, account_type FROM Users WHERE email = ?',
                [email]
            );
            return users[0];
        } finally {
            conn.release();
        }
    }

    // Get additional user info based on account type
    static async getAdditionalInfo(userId, accountType) {
        const conn = await this.getConnection();
        try {
            if (accountType === 'doctor') {
                const [doctorInfo] = await conn.query(
                    'SELECT doctor_id, specialty_id FROM Doctors WHERE user_id = ?',
                    [userId]
                );
                return doctorInfo[0];
            } else if (accountType === 'patient') {
                const [patientInfo] = await conn.query(
                    'SELECT patient_id FROM Patients WHERE user_id = ?',
                    [userId]
                );
                return patientInfo[0];
            }
            return {};
        } finally {
            conn.release();
        }
    }

    // Verify password
    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Generate tokens
    static generateTokens(userData) {
        const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            userData,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        return { accessToken, refreshToken };
    }

    // Password reset methods
    static async storeResetToken(email, resetCode) {
        const conn = await this.getConnection();
        try {
            const resetExpires = new Date(Date.now() + 3600000);
            await conn.query(
                'UPDATE Users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
                [resetCode, resetExpires, email]
            );
        } finally {
            conn.release();
        }
    }

    static async verifyResetToken(email, resetCode) {
        const conn = await this.getConnection();
        try {
            const [users] = await conn.query(
                'SELECT user_id FROM Users WHERE email = ? AND reset_password_token = ? AND reset_password_expires > NOW()',
                [email, resetCode]
            );
            return users.length > 0;
        } finally {
            conn.release();
        }
    }

    static async updatePassword(email, newPassword) {
        const conn = await this.getConnection();
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await conn.query(
                'UPDATE Users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?',
                [hashedPassword, email]
            );
        } finally {
            conn.release();
        }
    }
}

export default UserModel;