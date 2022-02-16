dotenv.config();
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/bootCamp.js";
import errorHandler from "./middleware/errorHandler.js";

connectDB();

const app = express();

//middleware
app.use(express.json());

//routes
app.use("/api/v1/bootcamps", router);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
