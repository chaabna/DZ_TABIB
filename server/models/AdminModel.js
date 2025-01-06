import db from '../db/database.js';

class AdminModel {
  // Check if a user is an admin
  static async isAdmin(userId) {
    const [admin] = await db.query('SELECT * FROM Admins WHERE user_id = ?', [userId]);
    return admin.length > 0;
  }
}


export default AdminModel;