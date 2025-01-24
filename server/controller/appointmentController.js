// controllers/appointmentController.js
import Appointment from '../models/Appointment.js';
import DoctorModel from '../models/DoctorModel.js';
import db from '../db/database.js';

// Get all appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.getAll();
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
    const { doctor_id, patient_id, appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required } = req.body;

    try {
        // Step 1: Get the doctor's max appointments per day
        const doctor = await DoctorModel.getById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const maxAppointments = doctor.max_appointments_per_day;

        // Step 2: Count the number of appointments for the doctor on the requested date
        const [appointments] = await db.query(
            'SELECT COUNT(*) AS appointment_count FROM Appointments WHERE doctor_id = ? AND appointment_date = ?',
            [doctor_id, appointment_date]
        );

        const appointmentCount = appointments[0].appointment_count;

        // Step 3: Check if the doctor has reached the limit
        if (appointmentCount >= maxAppointments) {
            return res.status(400).json({ error: `Dr. ${doctor.first_name} ${doctor.last_name} has reached the maximum of ${maxAppointments} appointments for the day.` });
        }

        // Step 4: Create the appointment if the limit is not reached
        const newAppointmentId = await Appointment.create(req.body);
        res.status(201).json({ id: newAppointmentId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get an appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.getById(req.params.id);
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update an appointment
export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required } = req.body;

    try {
        // Step 1: Check if the appointment exists
        const appointment = await Appointment.getById(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Step 2: Update the appointment with the provided fields
        await Appointment.update(id, { appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required });
        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Delete an appointment
export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.delete(req.params.id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};