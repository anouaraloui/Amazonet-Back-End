import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { payOrderEmailTemplate, welcome } from "../utils/sendEmail.js";

// Service for create a new order
export const addNewOrder = async (id, userID, data, io) => {
    return await Order.find().where('user').equals(userID).exec()
        .then(async (orderUser) => {
            const oldProductID = orderUser.map((id) => (id.productID).toString());
            const findProductOrder = () => {
                for (let i = 0, oldProduct = oldProductID.length; i <= oldProduct; i++) {
                    if (oldProductID[i] === id) return { status: true, value: oldProductID[i] };
                };
                return { status: false, value: id };
            };
            const productValueID = findProductOrder();
            if (productValueID.status) {
                return await Order.findOne({ productID: productValueID.value }).where('user').equals(userID).exec()
                    .then(async (orderProductFind) => {
                        const newNumberOfPieces = orderProductFind.numberOfPieces + data.numberOfPieces;
                        const newPriceOrder = orderProductFind.itemsPrice * newNumberOfPieces;
                        await Order.findByIdAndUpdate(
                            {
                                _id: orderProductFind._id
                            },
                            {
                                $set: {
                                    numberOfPieces: newNumberOfPieces,
                                    totalPrice: newPriceOrder
                                }
                            }
                        );
                        await orderProductFind.save();
                        return { status: 200, success: true, message: 'Order updatet because you already have order with this product' };
                    }).catch((err) => {
                        return { status: 400, success: false, error: err.message };
                    });
            } else try {
                return await Product.findById(id)
                    .then(async (product) => {
                        const newOrder = new Order({
                            orderItems: product,
                            productID: id,
                            shippingAddress: data.shippingAddress,
                            paymentMethod: data.paymentMethod,
                            itemsPrice: product.totalPrice,
                            numberOfPieces: data.numberOfPieces,
                            user: userID,
                        });
                        await newOrder.save();
                        // io.of('orders').emit('newOrder', {
                        //     orderId: newOrder._id,
                        //     productId: newOrder.productID,
                        //     customerId: newOrder.user
                        // });
                        // console.log(`Notification sent to deliveryman for order ${newOrder._id}`);
                        return { status: 201, success: true, orders: newOrder, id: newOrder._id, user: newOrder.user, address: newOrder.shippingAddress };
                    }).catch((err) => {
                        return { status: 400, success: false, error: err.message };
                    });
            } catch (error) {
                return { status: 400, success: false, message: error.message };
            };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for diplay order
export const getOrders = async (userID, role) => {
    if (role === "Customer") {
        return await Order.find().where('user').equals(userID).exec()
            .then(async (orders) => {
                if (!orders) return { status: 404, success: false, message: "No orders yet!" };
                else {
                    const count = orders.length;
                    return { status: 200, success: true, listOrders: count, orders: orders };
                }

            }).catch((err) => {
                return { status: 500, success: false, message: err.message };
            });

    } else return await Order.find().exec()
        .then(async (orders) => {
            if (!orders) return { status: 404, success: false, message: "No orders yet!" };
            else {
                const count = await Order.count();
                return { status: 200, success: true, listOrders: count, orders: orders };
            }

        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for get one order
export const getOrderByID = async (id, userID, role) => {
    if (role === "Admin") {
        return await Order.findById(id).exec()
            .then((order) => {
                if (!order) return { status: 404, success: false, message: "Order not found!" };
                else return { status: 200, success: true, order: order };
            }).catch((err) => {
                return { status: 500, success: false, message: err.message };
            });
    } else return await Order.findById(id).where('user').equals(userID).exec()
        .then((order) => {
            if (!order) return { status: 404, success: true, message: 'Order not found!' };
            else return { status: 200, success: true, order: order };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for the deliver
export const isDelivered = async (id, user, decision) => {
    try {
        const order = await Order.findOne({ _id: id }).where('delivery.isDelivered').equals(false);
        if (!order) {
            return { status: 404, success: false, message: 'This order is not available now!' };
        };
        if (decision === true) {
            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        "isDelivered": true,
                        "delivery.deliverymanID": user,
                        "delivery.deliverymanStatus": true,
                        "delivery.deliveredAt": Date.now()
                    }
                },
                { new: true }
            );
        };
        return { status: 200, success: true, message: "Your answer is sent successfully" };
    } catch (err) {
        return { status: 500, success: false, message: err.message };
    };
};

// Service for the payement
export const isPaid = async (id, user, data) => {
    return await Order.findById(id).where('user').equals(user).where('delivery.isDelivered').equals(true).exec()
        .then(async (order) => {
            if (!order) return { status: 404, success: true, message: 'Order not found!' };
            else {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.orderStatus = true;
                order.paymentResult = {
                    id: user,
                    status: data.status,
                    update_time: Date.now(),
                    email_address: data.email_address
                };
                const updateOrder = await order.save();
                payOrderEmailTemplate(data.email_address, order);
                return { status: 200, success: true, message: "Order updated!", order: updateOrder };
            }
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service to delete order
export const deleteOrder = async (id, user) => {
    return await Order.findById(id).where('user').equals(user).exec()
        .then(async (order) => {
            if (!order) return { status: 404, success: false, message: 'Order not found!' };
            else {
                if (order.isDelivered && !order.isPaid) return { status: 400, success: false, message: "Unable to delete this order!" }
                if (order.orderStatus || (!order.orderStatus && !order.isDelivered)) {
                    await order.remove();
                    return { status: 200, success: true, message: "Order deleted!" };
                };
            };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for update an order
export const updateOrder = async (id, user, data) => {
    return Order.findById(id).where('user').equals(user).exec()
        .then(async (order) => {
            if (!order) return { status: 404, success: false, message: 'Order not found!' };
            else {
                if (order.isDelivered) return { status: 400, success: false, message: 'Unable to update this order!' };
                else {
                    const orderUpdated = await Order.findByIdAndUpdate(
                        { _id: id },
                        {
                            $set: {
                                "numberOfPieces": data.numberOfPieces || order.numberOfPieces,
                                "paymentMethod": data.paymentMethod || order.paymentMethod,
                                "shippingAddress": data.shippingAddress || order.shippingAddress
                            }
                        }
                    );
                    await orderUpdated.save();
                    return { status: 200, success: true, message: "Order updated", order: orderUpdated }
                }
            };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};