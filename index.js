import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes";
import authRouter from "./routes/auth-router"
import productRouter from "./routes/product-route";
import paymentRouter from "./routes/stripe-payment";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter );
app.use("/api/payment", paymentRouter );

mongoose.set('strictQuery', false);
mongoose
  .connect(
    process.env.Mongo_URL
  )
  .then(() => app.listen(process.env.PORT || 5000))
  .then(() => console.log("Connected to Database and server started on port 5000"))
  .catch((err) => (console.log(err)));