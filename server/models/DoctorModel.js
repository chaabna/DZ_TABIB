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
    async getById(id) {
        const [doctor] = await pool.execute(`
          SELECT 
            d.*,
            s.specialty_name,
            GROUP_CONCAT(DISTINCT l.language_name) as languages,
            GROUP_CONCAT(DISTINCT m.mutuelle_name) as mutuelles,
            GROUP_CONCAT(DISTINCT 
              JSON_OBJECT(
                'type', ct.type_name,
                'rate', dct.hourly_rate,
                'duration', dct.consultation_duration
              )
            ) as consultation_types
          FROM Doctors d
          LEFT JOIN Specialties s ON d.specialty_id = s.specialty_id
          LEFT JOIN DoctorLanguages dl ON d.doctor_id = dl.doctor_id
          LEFT JOIN Languages l ON dl.language_id = l.language_id
          LEFT JOIN DoctorMutuelles dm ON d.doctor_id = dm.doctor_id
          LEFT JOIN Mutuelles m ON dm.mutuelle_id = m.mutuelle_id
          LEFT JOIN DoctorConsultationTypes dct ON d.doctor_id = dct.doctor_id
          LEFT JOIN ConsultationTypes ct ON dct.consultation_type_id = ct.consultation_type_id
          WHERE d.doctor_id = ?
          GROUP BY d.doctor_id
        `, [id]);
        return doctor;
      }
      async search({ specialtyId, mutuelleId, provinceId, consultationTypeId, languageId }) {
        const [doctors] = await pool.execute(
          'CALL SearchDoctors(?, ?, ?, ?, ?)',
          [specialtyId || null, mutuelleId || null, provinceId || null, consultationTypeId || null, languageId || null]
        );
        return doctors[0]; // First element contains the result set
      }
    
}

export default DoctorModel;