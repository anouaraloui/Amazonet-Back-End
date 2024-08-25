import { addNewOrder, deleteOrder, getOrderByID, getOrders, isDelivered, isPaid, updateOrder } from "../services/orderServices.js";
import whoUserConnected from "../utils/user.js";

// Controller for create a new order
export const addNewOrderControlelr = async (req, res, io) => {
    const  user = (await whoUserConnected(req)).userId;  
    const {id} = req.params;
    const addNewOrderService = await addNewOrder(id, user, req.body, );
    //const addNewOrderService = await addNewOrder(id, user, req.body, io);

    // if (addNewOrderService.success) {
    //    req.io.emit('newOrder', addNewOrderService)
    // }

    return res.status(addNewOrderService.status).json({response: addNewOrderService});
};

// Controller for diplay orders
export const getOrdersController = async (req, res) => {
    const user = (await whoUserConnected(req)).userId;
    const role = (await whoUserConnected(req)).role;
    const getOrdersService = await getOrders(user, role);
    return res.status(getOrdersService.status).json({ response: getOrdersService });
};

// Controller for get one order
export const getOrderByIDController = async (req, res) => {
    const {id} = req.params;
    const user = (await whoUserConnected(req)).userId;
    const role = (await whoUserConnected(req)).role;
    const getOrderByIDService = await getOrderByID(id, user, role);
    return res.status(getOrderByIDService.status).json({ response: getOrderByIDService });
};

// Controller for the deliver
export const isDeliveredController = async (req, res) => {
    const {id} = req.params;
    const user = ((await whoUserConnected(req)).userId);
    const isDeliveredService = await isDelivered(id, user, req.body.decision);
    return res.status(isDeliveredService.status).json({ response: isDeliveredService });
};

// Controller for ther payment
export const isPaidController = async (req, res) => {
    const {id} = req.params;
    const user = ((await whoUserConnected(req)).userId);
    const isPaidService = await isPaid(id, user, req.body);
    return res.status(isPaidService.status).json({ response: isPaidService });
};

// Controller to delete order
export const deleteOrderController = async (req, res) => {
    const {id} = req.params;
    const user = ((await whoUserConnected(req)).userId);
    const deleteOrderService = await deleteOrder(id, user);
    return res.status(deleteOrderService.status).json({ response: deleteOrderService });
};

// Controller for update an order
export const updateOrderController = async (req, res) => {
    const {id} = req.params;
    const user = ((await whoUserConnected(req)).userId);
    const updateOrderService = await updateOrder(id, user, req.body);
    return res.status(updateOrderService.status).json({ response: updateOrderService });
};