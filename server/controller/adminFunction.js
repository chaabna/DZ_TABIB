import ProfileModel from '../models/ProfileModel.js';
import AdminModel from '../models/AdminModel.js';
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
  export default {

    updateOtherProfile,
    deleteOtherProfile,
    suspendUser,
    unsuspendUser,
  };