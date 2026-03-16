const express = require("express");
const router = express.Router();

const wardenController = require("../controllers/wardenController");
const { verifyWarden } = require("../middleware/wardenMiddleware");


// ================= PROFILE =================

// get warden profile
router.get("/profile", verifyWarden, wardenController.getProfile);

// update profile
router.put("/profile", verifyWarden, wardenController.updateProfile);


// ================= COMPLAINTS =================

// get all complaints
router.get("/complaints", verifyWarden, wardenController.getAllComplaints);

// complaint details
router.get("/complaints/:id", verifyWarden, wardenController.getComplaintById);

// update complaint status
router.put("/complaints/:id", verifyWarden, wardenController.updateComplaintStatus);


// ================= LEAVE =================

// get leave applications
router.get("/leave", verifyWarden, wardenController.getAllLeaveApplications);

// leave details
router.get("/leave/:id", verifyWarden, wardenController.getLeaveApplicationById);

// approve/reject leave
router.put("/leave/:id", verifyWarden, wardenController.updateLeaveApplicationStatus);


module.exports = router;