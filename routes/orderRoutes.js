import express from "express";
import isAuth from "../middlewares/isAuth.js";
import checkRole from "../middlewares/checkRole.js";
import expressAsyncHandler from "express-async-handler";
import validatorID from "../middlewares/validatorID.js";
import { addNewOrderControlelr, deleteOrderController, getOrderByIDController, getOrdersController, isDeliveredController, isPaidController, updateOrderController } from "../controllers/orderControllers.js";
import { createOrderValidator } from "../middlewares/bodyValidator.js";

const router = express.Router();

// Route  for create a new order
router.post('/:id', isAuth, validatorID, createOrderValidator, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(addNewOrderControlelr));

// Route for display orders
router.get('', isAuth,  (req, res, next) => checkRole(['Admin', 'Customer', 'Deliveryman'], req, res, next), 
expressAsyncHandler(getOrdersController));

// Route for display one order
router.get('/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(getOrderByIDController));

// Route for the deliver
router.patch('/deliver/:id', isAuth, validatorID, (req, res, next) => checkRole(['Deliveryman'], req, res, next),
expressAsyncHandler(isDeliveredController));

// Route for the payement
router.patch('/pay/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(isPaidController));

// Route for delete an order
router.delete('/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(deleteOrderController));

// Route for update an order
router.patch('/:id',isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(updateOrderController));

export default router;