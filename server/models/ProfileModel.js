import db from "../db/database.js";

class ProfileModel {
  // Get user by ID
  static async getUserById(userId) {
    const [user] = await db.query("SELECT * FROM Users WHERE user_id = ?", [
      userId,
    ]);
    return user[0];
  }

  // Get all users by account type (e.g., patient, doctor)
  static async getUsersByAccountType(accountType) {
    const [users] = await db.query(
      "SELECT * FROM Users WHERE account_type = ?",
      [accountType]
    );
    return users;
  }

  static async updateUserProfile(
    userId,
    profileData,
    addresses,
    workingHours,
    languages,
    mutuelles,
    profileImage
  ) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Check the user's account type
      const [user] = await conn.query(
        "SELECT account_type FROM Users WHERE user_id = ?",
        [userId]
      );
      if (!user.length) {
        throw new Error("User not found");
      }

      const accountType = user[0].account_type;

      if (accountType === "doctor") {
        // Update Doctors table
        const {
          first_name,
          last_name,
          phone,
          experience_years,
          education_background,
          professional_statement,
        } = profileData;
        await conn.query(
          `UPDATE Doctors 
                     SET first_name = ?, last_name = ?, phone = ?, experience_years = ?, education_background = ?, professional_statement = ?, profile_image_url = ?
                     WHERE user_id = ?`,
          [
            first_name,
            last_name,
            phone,
            experience_years,
            education_background,
            professional_statement,
            profileImage,
            userId,
          ]
        );

        // Update DoctorAddresses table
        for (const address of addresses) {
          const {
            address_id,
            street_address,
            additional_details,
            commune_id,
            is_primary,
          } = address;
          await conn.query(
            `UPDATE Addresses 
                         SET street_address = ?, additional_details = ?, commune_id = ?
                         WHERE address_id = ?`,
            [street_address, additional_details, commune_id, address_id]
          );
          await conn.query(
            `UPDATE DoctorAddresses 
                         SET is_primary = ?
                         WHERE doctor_id = (SELECT doctor_id FROM Doctors WHERE user_id = ?) AND address_id = ?`,
            [is_primary, userId, address_id]
          );
        }

        // Update DoctorWorkingHours table
        for (const workingHour of workingHours) {
          const { working_hours_id, day_of_week, start_time, end_time } =
            workingHour;
          await conn.query(
            `UPDATE DoctorWorkingHours 
                         SET day_of_week = ?, start_time = ?, end_time = ?
                         WHERE working_hours_id = ? AND doctor_id = (SELECT doctor_id FROM Doctors WHERE user_id = ?)`,
            [day_of_week, start_time, end_time, working_hours_id, userId]
          );
        }

        // Update DoctorLanguages table
        await conn.query(
          "DELETE FROM DoctorLanguages WHERE doctor_id = (SELECT doctor_id FROM Doctors WHERE user_id = ?)",
          [userId]
        );
        for (const language of languages) {
          await conn.query(
            `INSERT INTO DoctorLanguages (doctor_id, language_id)
                         VALUES ((SELECT doctor_id FROM Doctors WHERE user_id = ?), ?)`,
            [userId, language.language_id]
          );
        }

        // Update DoctorMutuelles table
        await conn.query(
          "DELETE FROM DoctorMutuelles WHERE doctor_id = (SELECT doctor_id FROM Doctors WHERE user_id = ?)",
          [userId]
        );
        for (const mutuelle of mutuelles) {
          await conn.query(
            `INSERT INTO DoctorMutuelles (doctor_id, mutuelle_id)
                         VALUES ((SELECT doctor_id FROM Doctors WHERE user_id = ?), ?)`,
            [userId, mutuelle.mutuelle_id]
          );
        }
      } else if (accountType === "patient") {
        // Update Patients table
        const { first_name, last_name, phone, date_of_birth, gender } =
          profileData;
        await conn.query(
          `UPDATE Patients 
                     SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, profile_image_url = ?
                     WHERE user_id = ?`,
          [
            first_name,
            last_name,
            phone,
            date_of_birth,
            gender,
            profileImage,
            userId,
          ]
        );
      } else {
        throw new Error("Invalid account type");
      }

      await conn.commit();
      return 1; // Success
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Delete user by ID
  static async deleteUserById(userId) {
    // Delete related records first (e.g., Patients, Doctors)
    await db.query("DELETE FROM Patients WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM Doctors WHERE user_id = ?", [userId]);

    // Delete the user
    const [result] = await db.query("DELETE FROM Users WHERE user_id = ?", [
      userId,
    ]);
    return result.affectedRows;
  }

  // Search users by name or email
  static async searchUsers(name) {
    const [users] = await db.query(
      "SELECT * FROM Users WHERE username LIKE ? OR email LIKE ?",
      [`%${name}%`, `%${name}%`]
    );
    return users;
  }

  // Suspend user by ID
  static async suspendUser(userId, suspensionReason) {
    const [result] = await db.query(
      "UPDATE Users SET is_suspended = TRUE, suspension_reason = ?, suspended_at = NOW() WHERE user_id = ?",
      [suspensionReason, userId]
    );
    return result.affectedRows;
  }

  // Unsuspend user by ID
  static async unsuspendUser(userId) {
    const [result] = await db.query(
      "UPDATE Users SET is_suspended = FALSE, suspension_reason = NULL, suspended_at = NULL WHERE user_id = ?",
      [userId]
    );
    return result.affectedRows;
  }

  static async getUser(userId) {
    const [rows] = await db.query("SELECT * FROM Users WHERE user_id = ?", [
      userId,
    ]);
    return rows; // Returns an array of rows
  }

  static async updatePassword(userId, newPasswordHash) {
    const [result] = await db.query(
      "UPDATE Users SET password_hash = ? WHERE user_id = ?",
      [newPasswordHash, userId]
    );
    return result.affectedRows;
  }
}

export default ProfileModel;
