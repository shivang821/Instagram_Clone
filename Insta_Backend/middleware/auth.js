const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")
exports.isAuthenticate = async(req, res, next) => {
    try {
        const { instaToken } = req.cookies;
        if (!instaToken) {
            return res.status(401).json({ success: false, message: "please login to access this page" })
        }
        const decodedData = jwt.verify(instaToken, process.env.JWT_SECRET)
        const user = await User.findById(decodedData.id);
        if (!user) return res.status(400).json({ success: false, message: "please login to access this page" })
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error })
    }
}