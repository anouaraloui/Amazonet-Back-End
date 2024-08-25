import express from "express";
import isAuth from "../middlewares/isAuth.js";
import checkRole from "../middlewares/checkRole.js";
import expressAsyncHandler from "express-async-handler";
import validatorID from "../middlewares/validatorID.js";
import { addNewOrderControlelr} from "../controllers/orderControllers.js";
import { createOrderValidator } from "../middlewares/bodyValidator.js";

const router = express.Router();

// Route  for create a new order
const createOrderRoute  = (io) => {
    router.post('/:id', isAuth, validatorID, createOrderValidator, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
  expressAsyncHandler((req, res) => addNewOrderControlelr(req, res, io)));
return router;
}


export default createOrderRoute;