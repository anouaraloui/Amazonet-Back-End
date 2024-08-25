import express from "express";
import expressAsyncHandler from "express-async-handler";
import { allUsersController, deleteUserController, displayOneUserController, getSummaryController, loginUserController, passwordResetController, passwordResetRequestController, registerController, updateProfileController } from "../controllers/userControllers.js";
import isAuth from "../middlewares/isAuth.js";
import checkRole from "../middlewares/checkRole.js";
import validatorID from "../middlewares/validatorID.js";
import { registerUserValidator } from "../middlewares/bodyValidator.js";

const router = express.Router();

// Route for register a new user
router.post('/auth/signup', registerUserValidator, expressAsyncHandler(registerController));

// Route for logIn
router.post('/auth/login', expressAsyncHandler(loginUserController));

// Route for request to reset user password
router.post('/auth/recoverPassword', expressAsyncHandler(passwordResetRequestController));

// Route for reset user password
router.patch('/auth/resetPassword', expressAsyncHandler(passwordResetController));

// Route for display all users
router.get('/users', isAuth, (req, res, next) => checkRole(['Admin'], req, res, next),
expressAsyncHandler(allUsersController));

// Route for display one user
router.get('/users/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(displayOneUserController));

// Route for update a user profile
router.put('/users/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(updateProfileController));

// Route for delete user
router.delete('/users/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin'], req, res, next), 
expressAsyncHandler(deleteUserController));

// Route for display summary of application
router.get('/summary', isAuth, (req, res, next) => checkRole(['Admin'], req, res, next),
getSummaryController);

export default router;