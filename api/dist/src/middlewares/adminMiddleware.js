"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: "Access denied not an Admin" });
    }
    next();
};
exports.isAdmin = isAdmin;
