import express from "express";
const router = express.Router();
import adminFunction from "../controller/adminFunction.js";

router.put("/profile/admin/:userId", adminFunction.updateOtherProfile);
router.delete("/profile/admin/:userId", adminFunction.deleteOtherProfile);
router.post("/user/suspend", adminFunction.suspendUser);
router.post("/user/unsuspend", adminFunction.unsuspendUser);
export default  router;