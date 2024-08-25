import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const checkRole = (roles, req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    (roles.includes(verifyToken.role)) ? next() : res.status(403).json({ error: 'Access denied' });
};

export default checkRole;