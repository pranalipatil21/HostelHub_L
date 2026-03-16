const bcrypt = require('bcryptjs');

const {
    Student,
    Warden,
    Complaint,
    Leave,
    Room
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

        const hashed = await bcrypt.hash(password, 10);

        const warden = await Warden.create({
            name,
            email,
            password: hashed,
            contactNumber
        });

        res.status(201).json({
            message: "Warden created"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



exports.getAllWardens = async (req, res) => {

    try {

        const wardens = await Warden.findAll({
            attributes: { exclude: ["password"] }
        });

        res.json(wardens);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.updateWarden = async (req, res) => {

    try {

        const warden = await Warden.findByPk(req.params.id);

        if (!warden) {
            return res.status(404).json({
                message: "Warden not found"
            });
        }

        const { password, ...data } = req.body;

        await warden.update(data);

        res.json({
            message: "Warden updated successfully",
            warden
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.deleteWarden = async (req, res) => {

    try {

        const warden = await Warden.findByPk(req.params.id);

        if (!warden) {
            return res.status(404).json({
                message: "Warden not found"
            });
        }

        await warden.destroy();

        res.json({
            message: "Warden deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= STUDENT MANAGEMENT =================

exports.getAllStudents = async (req, res) => {

    try {

        const students = await Student.findAll({
            attributes: { exclude: ["password"] }
        });

        res.json(students);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.getStudentById = async (req, res) => {

    try {

        const student = await Student.findByPk(req.params.id, {
            attributes: { exclude: ["password"] }
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.updateStudent = async (req, res) => {

    try {

        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const { password, ...data } = req.body;

        await student.update(data);

        res.json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.deleteStudent = async (req, res) => {

    try {

        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        await student.destroy();

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= ROOM CHANGE (ADMIN POWER) =================

exports.changeStudentRoom = async (req, res) => {

    try {

        const { studentId, roomNumber } = req.body;

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const newRoom = await Room.findOne({
            where: { roomNumber }
        });

        if (!newRoom) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (newRoom.occupiedBeds >= newRoom.capacity) {
            return res.status(400).json({
                message: "Room is full"
            });
        }

        if (student.RoomId) {

            const oldRoom = await Room.findByPk(student.RoomId);

            if (oldRoom) {
                oldRoom.occupiedBeds -= 1;
                await oldRoom.save();
            }

        }

        newRoom.occupiedBeds += 1;

        if (newRoom.occupiedBeds === newRoom.capacity) {
            newRoom.status = "full";
        }

        await newRoom.save();

        student.RoomId = newRoom.id;

        await student.save();

        res.json({
            message: "Student room updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= COMPLAINT MANAGEMENT =================

exports.getAllComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.findAll({
            order: [["createdAt", "DESC"]]
        });

        res.json(complaints);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.getComplaintById = async (req, res) => {

    try {

        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json(complaint);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



exports.updateComplaintStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "Open",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid complaint status"
            });
        }

        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
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

        res.status(500).json({
            error: error.message
        });

    }

};



exports.deleteComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        await complaint.destroy();

        res.json({
            message: "Complaint deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= CGPA MANAGEMENT =================

exports.addCgpaData = async (req, res) => {

    try {

        const { studentId, CGPA } = req.body;

        if (!studentId || CGPA === undefined) {
            return res.status(400).json({
                message: "studentId and CGPA required"
            });
        }

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        student.CGPA = CGPA;

        await student.save();

        res.json({
            message: "CGPA updated successfully",
            student
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};