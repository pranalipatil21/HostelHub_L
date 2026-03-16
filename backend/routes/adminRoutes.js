const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/adminMiddleware");


// ================= WARDEN MANAGEMENT =================

// create warden
router.post("/wardens", verifyAdmin, adminController.registerWarden);

// get wardens
router.get("/wardens", verifyAdmin, adminController.getAllWardens);

// update warden
router.put("/wardens/:id", verifyAdmin, adminController.updateWarden);

// delete warden
router.delete("/wardens/:id", verifyAdmin, adminController.deleteWarden);



// ================= STUDENT MANAGEMENT =================

// get all students
router.get("/students", verifyAdmin, adminController.getAllStudents);

// student details
router.get("/students/:id", verifyAdmin, adminController.getStudentById);

// update student
router.put("/students/:id", verifyAdmin, adminController.updateStudent);

// delete student
router.delete("/students/:id", verifyAdmin, adminController.deleteStudent);



// ================= COMPLAINT MANAGEMENT =================

// get complaints
router.get("/complaints", verifyAdmin, adminController.getAllComplaints);

// complaint details
router.get("/complaints/:id", verifyAdmin, adminController.getComplaintById);

// update complaint status
router.put("/complaints/:id", verifyAdmin, adminController.updateComplaintStatus);

// delete complaint
router.delete("/complaints/:id", verifyAdmin, adminController.deleteComplaint);



// ================= ACADEMIC MANAGEMENT =================

// add CGPA
router.post("/cgpa", verifyAdmin, adminController.addCgpaData);


module.exports = router;