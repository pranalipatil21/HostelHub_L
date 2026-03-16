const bcrypt = require('bcryptjs');

const { 
    Student, 
    Warden, 
    Complaint, 
    Leave 
} = require('../models');



// ================= WARDEN MANAGEMENT =================

exports.registerWarden = async (req, res) => {

    try {

        const { name, email, password, contactNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        const existing = await Warden.findOne({
            where: { email }
        });

        if (existing) {
            return res.status(409).json({
                message: "Warden already exists"
            });
        }

        const hashed = await bcrypt.hash(password,10);

        const warden = await Warden.create({
            name,
            email,
            password: hashed,
            contactNumber
        });

        res.status(201).json({
            message:"Warden created",
            warden
        });

    } catch (error) {
        res.status(500).json({ message:error.message });
    }

};

exports.getAllWardens = async (req, res) => {

    try {

        const wardens = await Warden.findAll();

        res.json(wardens);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.updateWarden = async (req, res) => {

    try {

        const warden = await Warden.findByPk(req.params.id);

        if (!warden) {
            return res.status(404).json({ message: "Warden not found" });
        }

        await warden.update(req.body);

        res.json({
            message: "Warden updated successfully",
            warden
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.deleteWarden = async (req, res) => {

    try {

        const warden = await Warden.findByPk(req.params.id);

        if (!warden) {
            return res.status(404).json({ message: "Warden not found" });
        }

        await warden.destroy();

        res.json({ message: "Warden deleted successfully" });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

// ================= STUDENT MANAGEMENT =================

exports.getAllStudents = async (req, res) => {

    try {

        const students = await Student.findAll();

        res.json(students);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.getStudentById = async (req, res) => {

    try {

        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.updateStudent = async (req, res) => {

    try {

        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await student.update(req.body);

        res.json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.deleteStudent = async (req, res) => {

    try {

        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await student.destroy();

        res.json({ message: "Student deleted successfully" });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};


// ================= COMPLAINT MANAGEMENT =================

exports.getAllComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.findAll();

        res.json(complaints);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.getComplaintById = async (req, res) => {

    try {

        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json(complaint);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.updateComplaintStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        complaint.status = status;

        if (status === "Resolved") {
            complaint.resolvedAt = new Date();
        }

        await complaint.save();

        res.json({
            message: "Complaint updated successfully",
            complaint
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.deleteComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        await complaint.destroy();

        res.json({ message: "Complaint deleted successfully" });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};


// ================= FEEDBACK / CGPA =================

exports.addCgpaData = async (req, res) => {

    try {

        const { studentId, CGPA } = req.body;

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.CGPA = CGPA;

        await student.save();

        res.json({
            message: "CGPA updated successfully",
            student
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};