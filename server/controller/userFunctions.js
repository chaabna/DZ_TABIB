import ProfileModel from '../models/ProfileModel.js';
import AdminModel from '../models/AdminModel.js';
import bcrypt from 'bcrypt';

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await ProfileModel.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Get User
const getUser = async (req, res) => {
  try {
    const user = await ProfileModel.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Get All Patients
const getAllpatient = async (req, res) => {
  try {
    const patients = await ProfileModel.getUsersByAccountType('patient');
    if (patients.length === 0) {
      return res.status(404).json({ msg: 'No patient found' });
    }
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Get All Doctors
// const getAlldoctores = async (req, res) => {
//   try {
//     const doctors = await ProfileModel.getUsersByAccountType('doctor');
//     if (doctors.length === 0) {
//       return res.status(404).json({ msg: 'No doctor found' });
//     }
//     res.status(200).json(doctors);
//   } catch (err) {
//     res.status(500).json({ msg: 'Internal server error' });
//   }
// };

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { profileData, addresses, workingHours, languages, mutuelles, profileImage } = req.body;
    const userId = req.params.userId;

    // Validate profileData
    if (!profileData || typeof profileData !== 'object') {
      return res.status(400).json({ msg: 'Invalid profile data' });
    }

    // Validate other inputs (optional but recommended)
    if (addresses && !Array.isArray(addresses)) {
      return res.status(400).json({ msg: 'Invalid addresses data' });
    }
    if (workingHours && !Array.isArray(workingHours)) {
      return res.status(400).json({ msg: 'Invalid working hours data' });
    }
    if (languages && !Array.isArray(languages)) {
      return res.status(400).json({ msg: 'Invalid languages data' });
    }
    if (mutuelles && !Array.isArray(mutuelles)) {
      return res.status(400).json({ msg: 'Invalid mutuelles data' });
    }

    // Update the user profile
    const affectedRows = await ProfileModel.updateUserProfile(
      userId,
      profileData,
      addresses,
      workingHours,
      languages,
      mutuelles,
      profileImage
    );

    if (affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err.stack); // Log the full error stack trace
    res.status(500).json({ msg: 'Internal server error', error: err.message });
  }
};



// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    const affectedRows = await ProfileModel.deleteUserById(req.params.userId);
    if (affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};





// Search Users
const searchUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const users = await ProfileModel.searchUsers(name);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'No users found' });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};


//change password
const changePassword = async (req, res) => {
  try {
      const { oldPassword, newPassword, confirmNewPassword } = req.body;
      const userId = req.params.userId;

      // Validate inputs
      if (!oldPassword || !newPassword || !confirmNewPassword) {
          return res.status(400).json({ msg: 'All fields are required' });
      }

      if (newPassword !== confirmNewPassword) {
          return res.status(400).json({ msg: 'New passwords do not match' });
      }

      if (newPassword.length < 6) {
          return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
      }

      // Fetch the user's current password hash
      const [user] = await ProfileModel.getUser(userId);
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Verify the old password
      const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Old password is incorrect' });
      }

      // Hash the new password
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update the password in the database
      await ProfileModel.updatePassword(userId, newPasswordHash);

      res.status(200).json({ msg: 'Password updated successfully' });
  } catch (err) {
      console.error('Error changing password:', err);
      res.status(500).json({ msg: 'Internal server error', error: err.message });
  }
};

 


export default {
  getProfile,
  getUser,
  getAllpatient,
  updateProfile,
  deleteProfile,
  searchUsers,
  changePassword,
};