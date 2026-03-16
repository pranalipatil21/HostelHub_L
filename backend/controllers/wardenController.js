const { Warden, Complaint, Leave, Student } = require('../models');


// ================= PROFILE =================

exports.getProfile = async (req, res) => {

    try {

        const warden = await Warden.findByPk(req.user.id);

        if (!warden) {
            return res.status(404).json({ message: "Warden not found" });
        }

        res.json(warden);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



exports.updateProfile = async (req, res) => {

    try {

        const warden = await Warden.findByPk(req.user.id);

        if (!warden) {
            return res.status(404).json({ message: "Warden not found" });
        }

        await warden.update(req.body);

        res.json({
            message: "Profile updated successfully",
            warden
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



// ================= COMPLAINTS =================

exports.getAllComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.findAll({
            include: [Student],
            order: [['createdAt', 'DESC']]
        });

        res.json(complaints);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



exports.getComplaintById = async (req, res) => {

    try {

        const complaint = await Complaint.findByPk(req.params.id, {
            include: [Student]
        });

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

        const allowed = ["Open","In Progress","Resolved"];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
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
            message: "Complaint updated",
            complaint
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};



// ================= LEAVE =================

exports.getAllLeaveApplications = async (req, res) => {

    try {

        const leaves = await Leave.findAll({
            include: [Student],
            order: [['createdAt', 'DESC']]
        });

        res.json(leaves);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



exports.getLeaveApplicationById = async (req, res) => {

    try {

        const leave = await Leave.findByPk(req.params.id, {
            include: [Student]
        });

        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        res.json(leave);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



exports.updateLeaveApplicationStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const leave = await Leave.findByPk(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        leave.status = status;
        leave.decisionAt = new Date();
        leave.WardenId = req.user.id;

        await leave.save();

        res.json({
            message: "Leave status updated",
            leave
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};