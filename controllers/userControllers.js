import { deleteUser, forgetPassword, getSummary, getUserById, getUsersService, loginUser, register, resetPassword, updateProfile } from "../services/userServices.js"
import whoUserConnected from "../utils/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
// Controller for register a new user
export const registerController = async (req, res) => {
    const registerService = await register(req.body);    
    return res.status(registerService.status).json({ response: registerService });
};

//  Controller for Login user
export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    const loginUserService = await loginUser(email, password);
    return res.status(loginUserService.status).json({ response: loginUserService });
};

// Controller to send password reset request
export const passwordResetRequestController = async (req, res) => {
    const { email } = req.body;
    const passwordResetRequestService = await forgetPassword(email);
    return res.status(passwordResetRequestService.status).json({ response: passwordResetRequestService });
};

// Controller for password reset
export const passwordResetController = async (req, res) => {
    const {  token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userID;
    const passwordResetService = await resetPassword(id, token, password);
    return res.status(passwordResetService.status).json({ response: passwordResetService });
};

// Controller for display all users
export const allUsersController = async (req, res) => {
    const allUsersService = await getUsersService(req.query);
    return res.status(allUsersService.status).json({ response: allUsersService });
};

// Controller for display one user 
export const displayOneUserController = async (req, res) => {
    const { id } = req.params;
    const displayOneUserService = await getUserById(id);
    return res.status(displayOneUserService.status).json({ response: displayOneUserService });
};

// Controller for update a user profile
export const updateProfileController = async (req, res) => {
    const { id } = req.params;
    const user = (await whoUserConnected(req)).userId;
    const updateProfileService = await updateProfile(id, req.body, user);
    return res.status(updateProfileService.status).json({ response: updateProfileService });
};

// Controller for delete user
export const deleteUserController = async (req, res) => {
    const { id } = req.params;
    const deleteUserService = await deleteUser(id);
    return res.status(deleteUserService.status).json({ response: deleteUserService });
};

// Controller for display summary of application
export const getSummaryController = async (req, res) => {
    const getSummaryService = await getSummary();
    return res.status(getSummaryService.status).json({ response: getSummaryService });
}