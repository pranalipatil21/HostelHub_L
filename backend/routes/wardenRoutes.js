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
router.get("/complaints", verifyWarden, wardenController.getAllComplaints);
router.get("/complaints/:id", verifyWarden, wardenController.getComplaintById);
router.put("/complaints/:id", verifyWarden, wardenController.updateComplaintStatus);


// ================= LEAVE =================
router.get("/leave", verifyWarden, wardenController.getAllLeaveApplications);
router.get("/leave/:id", verifyWarden, wardenController.getLeaveApplicationById);
router.put("/leave/:id", verifyWarden, wardenController.updateLeaveApplicationStatus);

// ================= DASHBOARD =================
router.get("/dashboard", verifyWarden, wardenController.getDashboardStats);

// ================= MOVEMENT =================
router.get("/movement", verifyWarden, wardenController.getStudentMovement);


module.exports = router;