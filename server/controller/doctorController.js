import DoctorModel from '../models/DoctorModel.js';

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await DoctorModel.getAllDoctors();
        res.status(200).json(doctors);
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ msg: 'Internal server error', error: err.message });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const doctor = await DoctorModel.getDoctorById(doctorId);

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        res.status(200).json(doctor);
    } catch (err) {
        console.error('Error fetching doctor details:', err);
        res.status(500).json({ msg: 'Internal server error', error: err.message });
    }
};

export default {
    getAllDoctors,
    getDoctorById
};