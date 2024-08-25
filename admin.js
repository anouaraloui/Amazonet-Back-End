import connect from "./configuration/connectDB.js";
import User from "./models/userModel.js";
import adminData from "./admin.json" assert { type: "json" };
import { welcomeAdmin } from "./utils/sendEmail.js";
import bcrypt from "bcryptjs";

connect();

const admin =  async() => {
    try {
        const query = User.findOne({ 'role': 'Admin' }).select('role');
        const res = await query.exec();

        if (res) {
            console.log('Admin already exists!');
            return process.exit();
        } else {
            const admin = new User({ ...adminData, password: bcrypt.hashSync(adminData.password, 10) });
            await admin.save();
            console.log('Admin is created');
            welcomeAdmin(admin.email, admin.name, adminData.password);
        };
    } catch (err) {
        console.error(err.message);
    };
};

admin();