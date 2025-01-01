import ProfileModel from '../models/ProfileModel.js';
import AdminModel from '../models/AdminModel.js';
import UserModel from '../models/UserModel.js';

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
const getAlldoctores = async (req, res) => {
  try {
    const doctors = await ProfileModel.getUsersByAccountType('doctor');
    if (doctors.length === 0) {
      return res.status(404).json({ msg: 'No doctor found' });
    }
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
      const { username, email, profileData, addresses, workingHours, languages, mutuelles, profileImage } = req.body;
      const userId = req.params.userId;
  
      // Validate required fields
      if (!username || !email) {
        return res.status(400).json({ msg: 'Username and email are required' });
      }
  
      // Update the user profile
      const affectedRows = await ProfileModel.updateUserProfile(
        userId,
        username,
        email,
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
      console.error('Error updating profile:', err); // Log the error
      res.status(500).json({ msg: 'Internal server error', error: err.message });
    }
  };

// Update Other Profile (Admin Only)
const updateOtherProfile = async (req, res) => {
  try {
    const { adminId, username, email, password_hash } = req.body;
    const isAdmin = await AdminModel.isAdmin(adminId);
    if (!isAdmin) {
      return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' });
    }
    
    
   
    const affectedRows = await ProfileModel.updateUserProfile(req.params.userId, username, email, password_hash);
    if (affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
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

// Delete Other Profile (Admin Only)
const deleteOtherProfile = async (req, res) => {
  try {
    const { adminId } = req.body;
    const isAdmin = await AdminModel.isAdmin(adminId);
    if (!isAdmin) {
      return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' });
    }
    const affectedRows = await ProfileModel.deleteUserById(req.params.userId);
    if (affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Suspend User
const suspendUser = async (req, res) => {
  try {
    const { adminId, userId, suspensionReason } = req.body;
    const isAdmin = await AdminModel.isAdmin(adminId);
    if (!isAdmin) {
      return res.status(401).json({ msg: 'Unauthorized: Only admins can suspend users' });
    }
    const affectedRows = await ProfileModel.suspendUser(userId, suspensionReason);
    if (affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'User suspended successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Unsuspend User
const unsuspendUser = async (req, res) => {
  try {
    const { adminId, userId } = req.body;
    const isAdmin = await AdminModel.isAdmin(adminId);
    if (!isAdmin) {
      return res.status(401).json({ msg: 'Unauthorized: Only admins can unsuspend users' });
    }
    const affectedRows = await ProfileModel.unsuspendUser(userId);
    if (affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'User unsuspended successfully' });
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

export default {
  getProfile,
  getUser,
  getAllpatient,
  getAlldoctores,
  updateProfile,
  updateOtherProfile,
  deleteProfile,
  deleteOtherProfile,
  searchUsers,
  suspendUser,
  unsuspendUser,
};