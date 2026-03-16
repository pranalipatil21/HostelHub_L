const {
    AllocationCycle,
    Floor,
    Room,
    Student,
    StudentAllocation
} = require("../models");

const sequelize = require("../config/database");



// ================= CREATE CYCLE =================

exports.createCycle = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const {
            academicYear,
            floors,
            roomsPerFloor,
            roomCapacity,
            freshersReservedRooms
        } = req.body;

        if (!academicYear || !floors || !roomsPerFloor) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        const existing = await AllocationCycle.findOne({
            where: { academicYear }
        });

        if (existing) {
            return res.status(409).json({
                message: "Cycle already exists"
            });
        }

        const cycle = await AllocationCycle.create({

            academicYear,
            floors,
            roomsPerFloor,
            roomCapacity,
            freshersReservedRooms

        }, { transaction });


        // ================= CREATE FLOORS =================

        const floorList = [];

        for (let i = 0; i < floors; i++) {

            const floor = await Floor.create({

                floorNumber: i,
                AllocationCycleId: cycle.id

            }, { transaction });

            floorList.push(floor);

        }



        // ================= CREATE ROOMS =================

        let reservedCounter = freshersReservedRooms || 0;

        for (const floor of floorList) {

            for (let i = 1; i <= roomsPerFloor; i++) {

                let roomNumber = floor.floorNumber * 100 + i;

                if (floor.floorNumber === 0) {
                    roomNumber = String(i).padStart(3, "0");
                }

                const status = reservedCounter > 0
                    ? "reserved"
                    : "available";

                await Room.create({

                    roomNumber,
                    capacity: roomCapacity || 3,
                    occupiedBeds: 0,
                    status,
                    FloorId: floor.id,
                    AllocationCycleId: cycle.id

                }, { transaction });

                if (reservedCounter > 0) {
                    reservedCounter--;
                }

            }

        }

        await transaction.commit();

        res.status(201).json({
            message: "Allocation cycle created successfully",
            cycle
        });

    } catch (error) {

        await transaction.rollback();

        res.status(500).json({
            message: error.message
        });

    }

};



// ================= UPLOAD SGPA =================

exports.uploadSgpa = async (req, res) => {

    try {

        const { cycleId, students } = req.body;

        if (!cycleId || !students) {
            return res.status(400).json({
                message: "cycleId and students data required"
            });
        }

        for (const s of students) {

            const student = await Student.findByPk(s.studentId);

            if (student) {

                student.CGPA = s.sgpa;

                await student.save();

            }

        }

        res.json({
            message: "SGPA data uploaded"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// ================= GENERATE MERIT LIST =================

exports.generateMeritList = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const { cycleId } = req.body;

        const cycle = await AllocationCycle.findByPk(cycleId);

        if (!cycle) {
            return res.status(404).json({
                message: "Cycle not found"
            });
        }

        const students = await Student.findAll({
            order: [["CGPA", "DESC"]]
        });

        let rank = 1;

        for (const student of students) {

            await StudentAllocation.create({

                rank,
                sgpa: student.CGPA,
                StudentId: student.id,
                AllocationCycleId: cycle.id,
                status: "waiting"

            }, { transaction });

            rank++;

        }

        cycle.status = "merit_generated";

        await cycle.save({ transaction });

        await transaction.commit();

        res.json({
            message: "Merit list generated"
        });

    } catch (error) {

        await transaction.rollback();

        res.status(500).json({
            message: error.message
        });

    }

};



// ================= SET ELIGIBLE STUDENTS =================

exports.setEligibleStudents = async (req, res) => {

    try {

        const { cycleId, eligibleCount } = req.body;

        const allocations = await StudentAllocation.findAll({

            where: { AllocationCycleId: cycleId },

            order: [["rank", "ASC"]]

        });

        let count = 0;

        for (const allocation of allocations) {

            if (count < eligibleCount) {

                allocation.status = "eligible";

            } else {

                allocation.status = "waiting";

            }

            await allocation.save();

            count++;

        }

        res.json({
            message: "Eligible students updated"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// ================= OPEN ROOM SELECTION =================

exports.openRoomSelection = async (req, res) => {

    try {

        const { cycleId } = req.body;

        const cycle = await AllocationCycle.findByPk(cycleId);

        if (!cycle) {
            return res.status(404).json({
                message: "Cycle not found"
            });
        }

        cycle.status = "selection_open";

        await cycle.save();

        res.json({
            message: "Room selection opened"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// ================= CLOSE ROOM SELECTION =================

exports.closeRoomSelection = async (req, res) => {

    try {

        const { cycleId } = req.body;

        const cycle = await AllocationCycle.findByPk(cycleId);

        if (!cycle) {
            return res.status(404).json({
                message: "Cycle not found"
            });
        }

        cycle.status = "selection_closed";

        await cycle.save();

        res.json({
            message: "Room selection closed"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// ================= GET MERIT LIST =================

exports.getMeritList = async (req, res) => {

    try {

        const { cycleId } = req.params;

        const list = await StudentAllocation.findAll({

            where: { AllocationCycleId: cycleId },

            include: [{
                model: Student,
                attributes: ["id","name","PRN","CGPA"]
            }],

            order: [["rank","ASC"]]

        });

        res.json(list);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};