import jwt from 'jsonwebtoken';

const verifyAccessToken = (req, res, next) => {
    const token = req.cookies.accesstoken;
    
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ msg: 'Forbidden: Invalid token' });
        }

        // Set decoded values from token to request object
        req.userId = decoded.userId;
        req.accountType = decoded.accountType;  // Changed from userRole to accountType
        
        // Add type-specific IDs if they exist in the token
        if (decoded.doctor_id) req.doctorId = decoded.doctor_id;
        if (decoded.patient_id) req.patientId = decoded.patient_id;
        
        next();
    });
};

const verifyRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshtoken;
    
    if (!refreshToken) {
        return res.status(401).json({ msg: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: 'Invalid refresh token' });
        }

        // Create a new access token with all the original user information
        const newAccessToken = jwt.sign(
            { 
                userId: decoded.userId,
                accountType: decoded.accountType,
                doctor_id: decoded.doctor_id,    // Include if exists
                patient_id: decoded.patient_id   // Include if exists
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Set the new access token as a cookie
        res.cookie('accesstoken', newAccessToken, {
            maxAge: 1 * 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/"
        });

        res.status(200).json({ msg: 'Refresh successful', newAccessToken });
    });
};

export { verifyAccessToken, verifyRefreshToken };