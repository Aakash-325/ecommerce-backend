import express from "express";
import { getAllProducts, getById } from "../controller/product";

const productRouter = express.Router();

productRouter.get("/getProducts",getAllProducts);
productRouter.get("/getById/:id", getById);

export default productRouter;