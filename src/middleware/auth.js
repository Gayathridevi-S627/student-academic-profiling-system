function requireStudent(req, res, next) {
    if (!req.session.userId || req.session.role !== "student") {
        return res.status(401).json({
            message: "Please log in to access this page."
        });
    }

    next();
}

module.exports = { requireStudent };