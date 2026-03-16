const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const allocationCycleController = require("../controllers/allocationCycleController");

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



// ======================================================
//            ALLOCATION CYCLE MANAGEMENT
// ======================================================

// create allocation cycle
router.post("/allocation-cycle", verifyAdmin, allocationCycleController.createCycle);

// upload SGPA list
router.post("/allocation-cycle/upload-sgpa", verifyAdmin, allocationCycleController.uploadSgpa);

// generate merit list
router.post("/allocation-cycle/generate-merit", verifyAdmin, allocationCycleController.generateMeritList);

// set eligible students
router.post("/allocation-cycle/set-eligible", verifyAdmin, allocationCycleController.setEligibleStudents);

// open room selection
router.post("/allocation-cycle/open-selection", verifyAdmin, allocationCycleController.openRoomSelection);

// close room selection
router.post("/allocation-cycle/close-selection", verifyAdmin, allocationCycleController.closeRoomSelection);

// get merit list
router.get("/allocation-cycle/:cycleId/merit-list", verifyAdmin, allocationCycleController.getMeritList);


module.exports = router;