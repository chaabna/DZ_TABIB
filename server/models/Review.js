// models/Review.js
import db from '../db/database.js';

class Review {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Reviews');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM Reviews WHERE review_id = ?', [id]);
        return rows[0];
    }

    static async create({ doctor_id, patient_id, rating, review_text, verified_consultation }) {
        const [result] = await db.query(
            'INSERT INTO Reviews (doctor_id, patient_id, rating, review_text, verified_consultation) VALUES (?, ?, ?, ?, ?)',
            [doctor_id, patient_id, rating, review_text, verified_consultation]
        );
        return result.insertId;
    }

    static async update(id, fields) {
        // Dynamically build the SQL query based on the fields provided
        const setClause = Object.keys(fields)
            .map((key) => `${key} = ?`)
            .join(', ');

        const values = Object.values(fields);
        values.push(id); // Add the review_id at the end for the WHERE clause

        await db.query(
            `UPDATE reviews SET ${setClause} WHERE review_id = ?`,
            values
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM Reviews WHERE review_id = ?', [id]);
    }
}

export default Review;