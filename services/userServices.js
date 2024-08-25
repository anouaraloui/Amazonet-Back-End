import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../utils/token.js";
import { config } from "dotenv";
import { emailForgotPassword, emailResetPassword, welcome } from "../utils/sendEmail.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

config();

// Service for register a new user
export const register = async (data) => {
    return await User.findOne({ email: data.email })
        .then(async (user) => {
            if (user) return { status: 400, success: false, message: "Email already exist!" };
            const newUser = new User({
                name: data.name,
                email: data.email,
                password: bcrypt.hashSync(data.password),
                role: data.role
            });
            user = await newUser.save();
            welcome(user.email, user.name);
            return { status: 201, success: true, message: "Welcome", user: user };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for sign in
export const loginUser = async (email, password) => {
    return await User.findOne({ email })
        .then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    return { status: 200, success: true, message: "You have successfully logged In.", userId: user._id, role: user.role, token: generateToken(user), refreshToken: generateRefreshToken(user) };
                };
            } else return { status: 400, success: false, message: "Invalid email or password!" };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for request to reset the password
export const forgetPassword = async (email) => {
    const user = await User.findOne({ email: email })
    if (user) {
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        user.resetToken = token;
        await user.save();
        
        //reset link
        console.log(`${process.env.BASE_URL}/reset-password/${token}`);
        emailForgotPassword(user.email, user.name, token, user._id);
        return { status: 200, success: true, message: "We sent reset password link to your email." };
        // Configuration email with mailgun if you want to use mailgun (! is not free!!)
        // const emailData = {
        //     from: `Amazony Team <${process.env.EMAIL}>`,
        //     to: `${user.name} <${user.email}>`,
        //     subject: 'Reset Password',
        //           html: `
        //         <p>Please click the following link to reset your password:</p>
        //         <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
        //     `,
        //   };
        //   try {
        //     const response = await client.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        //     console.log(response);
        //     return { status: 200, success: true, message: "We sent reset password link to your email." };
        // } catch (emailError) {
        //     console.error(emailError);
        //     return { status: 500, success: false, message: "Failed to send email." };
        // }

    } else {
        return { status: 404, success: false, message: "User not found!" };
    };
};

// Service for reset password
export const resetPassword = async (id, token, password) => {
    try {
        const oldUser = await User.findById({ _id: id });
        const compareOldPass = bcrypt.compareSync(password, oldUser.password);
        if (compareOldPass) return { status: 400, success: false, message: 'You have entered an actual password. Please enter a new password or log in again using the same password.' };
        else {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
                if (err) return { status: 401, message: 'Invalid Token!' };
                else {
                    const user = await User.findOne({ resetToken: token });
                    if (user) {
                        if (password) {
                            user.password = bcrypt.hashSync(password, 10);
                            await user.save();
                            emailResetPassword(user.email, user.name)
                            return { status: 200, success: true, message: "Password reset successfully" };
                        };
                    } else return { status: 404, succes: false, message: "User not found!" };
                };
            });
        };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for get all users
export const getUsersService = async (data) => {
    try {
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const usersList = await User.find()
            .sort({ [data.sortBy]: 1 })
            .skip(skipPage)
            .limit(data.limit)
            .where('createdAt').lt(data.createdAtBefore).gt(data.createdAtAfter)
            .select('-password')
            .exec();
        const countList = await User.count();
        if (countList === 0) return { status: 404, success: false, message: "There are no users!" };
        return { status: 200, success: true, page: data.page, limit: data.limit, listUsers: countList, users: usersList };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for get user whose identifier is known
export const getUserById = async (id) => {
    return await User.findById(id).select('-password')
        .then((user) => {
            return { status: 200, success: true, user: user };
        }).catch(() => {
            return { status: 404, success: false, error: 'User not found!' };
        });
};

// Service for update a profile  
export const updateProfile = async (id, data, userID) => {
    return await User.findById(id)
        .then(async (user) => {            
            if (user && (user._id).toString() === userID) {
                user.name = data.name || user.name;
                if (data.password) user.password = bcrypt.hashSync(data.password, 10);
                const updateUser = await user.save();
                return {
                    status: 200,
                    success: true,
                    message: 'Successfully update the profile',
                    userId: updateUser._id
                };
            } else return { status: 404, success: false, message: "User not found!" };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

// Service for delete user 
export const deleteUser = async (id) => {
    try {
        const user = await User.findById(id);
        if (user) {
            if (user.role === "Admin") return { status: 400, success: false, message: "Can not delete Admin User!" };
            user.deleteOne(id);
            return { status: 200, success: true, message: "User deleted" };
        } else return { status: 404, success: false, message: "User not found!" };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Servie for display summary of the application
export const getSummary = async () => {
    try {

        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);
        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: { $sum: 1 },
                },
            },
        ]);
        const dailyOrders = await Order.aggregate([
            {
                $group: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const productCategories = await Product.aggregate([
            {
                $group: {
                    categorries: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);
        return { status: 200, success: true, users: users, orders: orders, dailyOrders: dailyOrders, productCategories: productCategories };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

