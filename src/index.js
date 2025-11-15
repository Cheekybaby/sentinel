// Imports
import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import verifyRoutes from './routes/verify.routes.js';
// Config
dotenv.config();
const app = express();
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',');

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) {
            return callback(null, true)
        }

        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not Allowed by Cors policy"))
        }
    },
    credentials: true ,
}))

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/verify', verifyRoutes);

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Set up complete");
});

app.listen(PORT, () => {
    console.log("Listening on port :", PORT);
    connectDB();
});