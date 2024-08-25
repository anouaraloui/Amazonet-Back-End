import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connect from "./configuration/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import HTTP from 'http';
import { Server } from 'socket.io';




// import createOrderRoute from './routes/createOrderRoute.js';


const app = express();

const server = HTTP.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your front-end URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

app.use(express.json({ limit: '9999999999mb' }));
app.use(express.urlencoded({ limit: '99999999mb', extended: true }));

app.use(cors({
    origin: "http://localhost:3000", // Allow your front-end URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(express.json());

config();
connect();



app.use(userRoutes);



// app.use("/ordersCreate", createOrderRoute(io))
app.use("/products", productRoutes);
app.use( "/orders", orderRoutes);
app.use('/api-swagger-amazonet', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
    next();
});


// io.on("connection", (socket) => {
//     console.log("user connected");

//     socket.on("disconnect", () => {
//         console.log("User disconnected");
        
//     })

//     socket.on("new_user_login", (data) => {
//         console.log("ran 2nd");
        
//         io.emit("new_user_login", {message: data.message});
        
//     })
    
// })



const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on: http://localhost:${port}`));