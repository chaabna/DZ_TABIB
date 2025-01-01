import pool from '../db/database.js';   


const verifyAuthorization = (allowedTypes) => {
    return (req, res, next) => {
        try {
            const accountType = req.accountType;

            if (!accountType) {
                return res.status(403).json({ msg: 'Invalid account type' });
            }

            if (!allowedTypes.includes(accountType)) {
                return res.status(401).json({ 
                    msg: 'Unauthorized: Not authorized to perform this operation' 
                });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ msg: 'Something went wrong' });
        }
    };
};

// const checkAuth = async (req, res, next) => {
//     try {
//         const connection = await pool.getConnection();
        
//         const [user] = await connection.execute(
//             `SELECT u.is_suspended, u.suspension_reason, u.account_type 
//              FROM Users u 
//              WHERE u.user_id = ?`,
//             [req.userId]
//         );
        
//         connection.release();

//         if (!user.length) {
//             return res.status(401).json({ msg: 'User not found' });
//         }

//         if (user[0].is_suspended) {
//             return res.status(403).json({
//                 msg: 'Account suspended',
//                 reason: user[0].suspension_reason
//             });
//         }

//         req.userRole = user[0].account_type;
        
//         next();
//     } catch (error) {
//         console.error('Authentication error:', error);
//         res.status(401).json({ msg: 'Authentication failed' });
//     }
// };

// const checkNotSuspended = async (req, res, next) => {
//     try {
//         const connection = await pool.getConnection();
//         const [user] = await connection.execute(
//             'SELECT is_suspended, suspension_reason FROM Users WHERE user_id = ?',
//             [req.params.id || req.body.userId]
//         );
//         connection.release();

//         if (user[0]?.is_suspended) {
//             return res.status(403).json({
//                 msg: 'Cannot perform operation on suspended account',
//                 reason: user[0].suspension_reason
//             });
//         }

//         next();
//     } catch (error) {
//         console.error('Suspension check error:', error);
//         res.status(500).json({ msg: 'Error checking account status' });
//     }
// };
// Middleware to check admin rights
// const isAdmin = (req, res, next) => {
//     if (req.userType !== 'admin') {
//         return res.status(403).json({ msg: 'Access denied. Admin rights required.' });
//     }
//     next();
// };

// // Middleware to check doctor rights
// const isDoctor = (req, res, next) => {
//     if (req.userType !== 'doctor' && req.userType !== 'admin') {
//         return res.status(403).json({ msg: 'Access denied. Doctor rights required.' });
//     }
//     next();
// };

export { verifyAuthorization, };