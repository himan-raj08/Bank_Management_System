import userModel from "../models/User.mdel.js"
import jwt from "jsonwebtoken";


async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized Access, token is missing"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (e) {

        console.log(e);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}



async function authSystemMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized Access, token is missing"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel
            .findById(decoded.userId)
            .select("+systemUser");


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        if (!user.systemUser) {
            return res.status(403).json({
                message: "Not a System user"
            });
        }


        req.user = user;

        next();


    } catch (e) {

        console.log(e);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}



export {
    authMiddleware,
    authSystemMiddleware
};