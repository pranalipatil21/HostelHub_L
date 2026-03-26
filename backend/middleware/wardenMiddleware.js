const jwt = require('jsonwebtoken');
const { Warden } = require('../models');

exports.verifyWarden = async (req, res, next) => {
    try {

        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const warden = await Warden.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!warden) {
            return res.status(404).json({
                message: "Warden not found"
            });
        }

        // ✅ FIX HERE
        req.user = warden;
        req.warden = warden;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};