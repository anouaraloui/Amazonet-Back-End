import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const whoUserConnected = async (req) => {
    try {
    const userToken = await req.headers.authorization.split(' ')[1];  
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      return  {userId: decoded.userID, role: decoded.role};
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Unauthorized');
    }
};
  
export default whoUserConnected;