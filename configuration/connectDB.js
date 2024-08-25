import mongoose from "mongoose";
import { config } from "dotenv";

config();

const url = process.env.URL;

mongoose.set('strictQuery', true);

const connect = () => {
    mongoose.connect(url)
    .then(() => {
        console.log("Successful connection");
        
    }).catch(() => {
        console.log("Unable to connect!");
        
    });
};

export default connect;