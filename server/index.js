// server.js

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/routerAuth.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import profilerRoutes from './routes/profileroutes.js';
import appointmentRoutes from './routes/appointments.js';
import reviewRoutes from './routes/reviews.js';
import swaggerDocs from './swagger.js'; // Import Swagger configuration
import YAML from 'yamljs';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
  }));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', doctorRoutes);
app.use('/api', profilerRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Serve Swagger documentation
swaggerDocs(app);


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
