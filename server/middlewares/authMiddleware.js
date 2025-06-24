// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");




const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized HTTP, Token not provided or malformed" });
    }

    // console.log("Token from auth middleware with bearer :",token);

    const jwtToken = token.replace("Bearer ", "").trim();

    // console.log("Token from auth middleware:",jwtToken);

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

        // console.log("user data from database:", isVerified);
        
        const userData = await User.findOne({ phoneNumber: isVerified.phoneNumber }).select({
            password: 0,
        });
        // console.log("user data from database:", userData);

        if (!userData) {
            return res
                .status(401)
                .json({ message: "Unauthorized. User not found." });
        }

        req.user = userData;
        req.token = token;
        req.userId = userData.phoneNumber;

        next();
    } catch (error) {
        // console.error("Error in authMiddleware:", error);
        return res
            .status(401)
            .json({ message: "Unauthorized. Invalid Token." });
    }
};

module.exports = authMiddleware;

