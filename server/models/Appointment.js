// models/Appointment.js
import db from '../db/database.js';

class Appointment {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Appointments');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM Appointments WHERE appointment_id = ?', [id]);
        return rows[0];
    }

    static async create({ doctor_id, patient_id, appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required }) {
        const [result] = await db.query(
            'INSERT INTO Appointments (doctor_id, patient_id, appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [doctor_id, patient_id, appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required]
        );
        return result.insertId;
    }

    static async update(id, { appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required }) {
        await db.query(
            'UPDATE Appointments SET appointment_date = ?, appointment_time = ?, consultation_type_id = ?, status = ?, notes = ?, medical_certificate_required = ? WHERE appointment_id = ?',
            [appointment_date, appointment_time, consultation_type_id, status, notes, medical_certificate_required, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM Appointments WHERE appointment_id = ?', [id]);
    }
}

export default Appointment;