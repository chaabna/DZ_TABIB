import db from '../db/database.js';

class ProfileModel {
  // Get user by ID
  static async getUserById(userId) {
    const [user] = await db.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
    return user[0];
  }

  // Get all users by account type (e.g., patient, doctor)
  static async getUsersByAccountType(accountType) {
    const [users] = await db.query('SELECT * FROM Users WHERE account_type = ?', [accountType]);
    return users;
  }

  // Update user profile
//   static async updateUserProfile(userId, username, email, profileData, addresses, workingHours, languages, mutuelles, profileImage) {
//     const conn = await db.getConnection();
//     try {
//       await conn.beginTransaction();
  
//       // Step 1: Update the Users table
//       const [userResult] = await conn.query(
//         'UPDATE Users SET username = ?, email = ? WHERE user_id = ?',
//         [username, email, userId]
//       );
  
//       if (userResult.affectedRows === 0) {
//         throw new Error('User not found');
//       }
  
//       // Step 2: Check the user's account type
//       const [user] = await conn.query('SELECT account_type FROM Users WHERE user_id = ?', [userId]);
  
//       if (user.length === 0) {
//         throw new Error('User not found');
//       }
  
//       const accountType = user[0].account_type;
  
//       // Step 3: Update the Doctors or Patients table based on account type
//       if (accountType === 'doctor') {
//         const { first_name, last_name, registration_number, phone, experience_years, education_background, professional_statement } = profileData;
  
//         await conn.query(
//           'UPDATE Doctors SET first_name = ?, last_name = ?, registration_number = ?, phone = ?, experience_years = ?, education_background = ?, professional_statement = ? WHERE user_id = ?',
//           [first_name, last_name, registration_number, phone, experience_years, education_background, professional_statement, userId]
//         );
  
//         // Step 4: Update the DoctorAddresses table (location)
//         for (const address of addresses) {
//           const { address_id, street_address, additional_details, commune_id, is_primary } = address;
  
//           await conn.query(
//             'UPDATE Addresses SET street_address = ?, additional_details = ?, commune_id = ? WHERE address_id = ?',
//             [street_address, additional_details, commune_id, address_id]
//           );
  
//           await conn.query(
//             'UPDATE DoctorAddresses SET is_primary = ? WHERE doctor_id = ? AND address_id = ?',
//             [is_primary, userId, address_id]
//           );
//         }
  
//         // Step 5: Update the DoctorWorkingHours table (working hours)
//         for (const workingHour of workingHours) {
//           const { working_hours_id, day_of_week, start_time, end_time } = workingHour;
  
//           await conn.query(
//             'UPDATE DoctorWorkingHours SET day_of_week = ?, start_time = ?, end_time = ? WHERE working_hours_id = ? AND doctor_id = ?',
//             [day_of_week, start_time, end_time, working_hours_id, userId]
//           );
//         }
  
//         // Step 6: Update the DoctorLanguages table (languages)
//         await conn.query('DELETE FROM DoctorLanguages WHERE doctor_id = ?', [userId]);
//         for (const language of languages) {
//           await conn.query(
//             'INSERT INTO DoctorLanguages (doctor_id, language_id) VALUES (?, ?)',
//             [userId, language.language_id]
//           );
//         }
  
//         // Step 7: Update the DoctorMutuelles table (insurance)
//         await conn.query('DELETE FROM DoctorMutuelles WHERE doctor_id = ?', [userId]);
//         for (const mutuelle of mutuelles) {
//           await conn.query(
//             'INSERT INTO DoctorMutuelles (doctor_id, mutuelle_id) VALUES (?, ?)',
//             [userId, mutuelle.mutuelle_id]
//           );
//         }
//       } else if (accountType === 'patient') {
//         const { first_name, last_name, phone, date_of_birth, gender } = profileData;
  
//         await conn.query(
//           'UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ? WHERE user_id = ?',
//           [first_name, last_name, phone, date_of_birth, gender, userId]
//         );
//       }
  
//       await conn.commit();
//       return userResult.affectedRows;
//     } catch (err) {
//         console.error('Error in updateUserProfile:', err);
//       await conn.rollback();
//       throw err;
//     } finally {
//       conn.release();
//     }
//   }
static async updateUserProfile(userId, username, email, profileData, addresses, workingHours, languages, mutuelles, profileImage) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      // Step 1: Validate profileData
      if (!profileData || typeof profileData !== 'object') {
        throw new Error('profileData is missing or invalid');
      }
  
      // Step 2: Update the Users table
      const [userResult] = await conn.query(
        'UPDATE Users SET username = ?, email = ?, WHERE user_id = ?',
        [username, email, userId]
      );
  
      if (userResult.affectedRows === 0) {
        throw new Error('User not found');
      }
  
      // Step 3: Check the user's account type
      const [user] = await conn.query('SELECT account_type FROM Users WHERE user_id = ?', [userId]);
  
      if (user.length === 0) {
        throw new Error('User not found');
      }
  
      const accountType = user[0].account_type;
  
      // Step 4: Update the Doctors or Patients table based on account type
      if (accountType === 'doctor') {
        const { 
          first_name = '', 
          last_name = '', 
          registration_number = '', 
          phone = '', 
          experience_years = 0, 
          education_background = '', 
          professional_statement = '' 
        } = profileData;
  
        await conn.query(
          'UPDATE Doctors SET first_name = ?, last_name = ?, registration_number = ?, phone = ?, experience_years = ?, education_background = ?, professional_statement = ? WHERE user_id = ?',
          [first_name, last_name, registration_number, phone, experience_years, education_background, professional_statement, userId]
        );
  
        // Step 5: Update the DoctorAddresses table (location)
        for (const address of addresses) {
          const { address_id, street_address, additional_details, commune_id, is_primary } = address;
  
          await conn.query(
            'UPDATE Addresses SET street_address = ?, additional_details = ?, commune_id = ? WHERE address_id = ?',
            [street_address, additional_details, commune_id, address_id]
          );
  
          await conn.query(
            'UPDATE DoctorAddresses SET is_primary = ? WHERE doctor_id = ? AND address_id = ?',
            [is_primary, userId, address_id]
          );
        }
  
        // Step 6: Update the DoctorWorkingHours table (working hours)
        for (const workingHour of workingHours) {
          const { working_hours_id, day_of_week, start_time, end_time } = workingHour;
  
          await conn.query(
            'UPDATE DoctorWorkingHours SET day_of_week = ?, start_time = ?, end_time = ? WHERE working_hours_id = ? AND doctor_id = ?',
            [day_of_week, start_time, end_time, working_hours_id, userId]
          );
        }
  
        // Step 7: Update the DoctorLanguages table (languages)
        await conn.query('DELETE FROM DoctorLanguages WHERE doctor_id = ?', [userId]);
        for (const language of languages) {
          await conn.query(
            'INSERT INTO DoctorLanguages (doctor_id, language_id) VALUES (?, ?)',
            [userId, language.language_id]
          );
        }
  
        // Step 8: Update the DoctorMutuelles table (insurance)
        await conn.query('DELETE FROM DoctorMutuelles WHERE doctor_id = ?', [userId]);
        for (const mutuelle of mutuelles) {
          await conn.query(
            'INSERT INTO DoctorMutuelles (doctor_id, mutuelle_id) VALUES (?, ?)',
            [userId, mutuelle.mutuelle_id]
          );
        }
      } else if (accountType === 'patient') {
        const { 
          first_name = '', 
          last_name = '', 
          phone = '', 
          date_of_birth = null, 
          gender = '' 
        } = profileData;
  
        await conn.query(
          'UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ? WHERE user_id = ?',
          [first_name, last_name, phone, date_of_birth, gender, userId]
        );
      }
  
      await conn.commit();
      return userResult.affectedRows;
    } catch (err) {
      console.error('Error in updateUserProfile:', err); // Log the error
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
  // Delete user by ID
  static async deleteUserById(userId) {
    // Delete related records first (e.g., Patients, Doctors)
    await db.query('DELETE FROM Patients WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM Doctors WHERE user_id = ?', [userId]);

    // Delete the user
    const [result] = await db.query('DELETE FROM Users WHERE user_id = ?', [userId]);
    return result.affectedRows;
  }

  // Search users by name or email
  static async searchUsers(name) {
    const [users] = await db.query(
      'SELECT * FROM Users WHERE username LIKE ? OR email LIKE ?',
      [`%${name}%`, `%${name}%`]
    );
    return users;
  }

  // Suspend user by ID
  static async suspendUser(userId, suspensionReason) {
    const [result] = await db.query(
      'UPDATE Users SET is_suspended = TRUE, suspension_reason = ?, suspended_at = NOW() WHERE user_id = ?',
      [suspensionReason, userId]
    );
    return result.affectedRows;
  }

  // Unsuspend user by ID
  static async unsuspendUser(userId) {
    const [result] = await db.query(
      'UPDATE Users SET is_suspended = FALSE, suspension_reason = NULL, suspended_at = NULL WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows;
  }
}

export default ProfileModel;