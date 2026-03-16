const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { verifyUser } = require("../middleware/authMiddleware");


// ================= PROFILE =================

// get student profile
router.get("/profile", verifyUser, studentController.getProfile);

// update profile
router.put("/profile", verifyUser, studentController.updateProfile);

// update hostel preference
router.patch("/hostel-preference", verifyUser, studentController.updateHostelPreference);


// ================= ROOM =================

// get my room
router.get("/room", verifyUser, studentController.getMyRoom);

// get available rooms
router.get("/rooms/available", verifyUser, studentController.getAvailableRooms);

// select room
router.post("/rooms/select", verifyUser, studentController.selectRoom);


// ================= COMPLAINT =================

// create complaint
router.post("/complaints", verifyUser, studentController.submitComplaint);

// get my complaints
router.get("/complaints", verifyUser, studentController.getMyComplaints);

// complaint details
router.get("/complaints/:id", verifyUser, studentController.getComplaintById);


// ================= LEAVE =================

// apply leave
router.post("/leave", verifyUser, studentController.applyLeave);

// leave history
router.get("/leave", verifyUser, studentController.getMyLeaveApplications);

// leave details
router.get("/leave/:id", verifyUser, studentController.getLeaveById);


// ================= MOVEMENT =================

// mark OUT
router.post("/movement/out", verifyUser, studentController.markOut);

// mark IN
router.post("/movement/in", verifyUser, studentController.markIn);

// movement history
router.get("/movement", verifyUser, studentController.getMovementHistory);


module.exports = router;