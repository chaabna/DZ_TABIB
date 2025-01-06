import db from '../db/database.js';

class DoctorModel {
    static async getAllDoctors() {
        const [rows] = await db.query(`
            SELECT d.doctor_id, d.first_name, d.last_name, d.registration_number, s.specialty_name, AVG(r.rating) AS average_rating
            FROM Doctors d
            JOIN Specialties s ON d.specialty_id = s.specialty_id
            LEFT JOIN Reviews r ON d.doctor_id = r.doctor_id
            GROUP BY d.doctor_id
        `);
        return rows;
    }


    static async getDoctorById(doctorId) {
        // Fetch doctor details
        const [doctor] = await db.query(`
            SELECT d.doctor_id, d.first_name, d.last_name, d.registration_number, d.phone, d.experience_years, d.education_background, d.professional_statement, d.profile_image_url, s.specialty_name, AVG(r.rating) AS average_rating
            FROM Doctors d
            JOIN Specialties s ON d.specialty_id = s.specialty_id
            LEFT JOIN Reviews r ON d.doctor_id = r.doctor_id
            WHERE d.doctor_id = ?
            GROUP BY d.doctor_id
        `, [doctorId]);

        if (!doctor.length) {
            return null;
        }

        // Fetch working hours
        const [workingHours] = await db.query(`
            SELECT day_of_week, start_time, end_time
            FROM DoctorWorkingHours
            WHERE doctor_id = ?
        `, [doctorId]);

        // Fetch languages
        const [languages] = await db.query(`
            SELECT l.language_name
            FROM DoctorLanguages dl
            JOIN Languages l ON dl.language_id = l.language_id
            WHERE dl.doctor_id = ?
        `, [doctorId]);

        // Fetch insurance providers (mutuelles)
        const [mutuelles] = await db.query(`
            SELECT m.mutuelle_name
            FROM DoctorMutuelles dm
            JOIN Mutuelles m ON dm.mutuelle_id = m.mutuelle_id
            WHERE dm.doctor_id = ?
        `, [doctorId]);

        return {
            ...doctor[0],
            workingHours,
            languages,
            mutuelles
        };
    }
}

export default DoctorModel;