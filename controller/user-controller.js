import mongoose from "mongoose";
import User from "../model/User";
import Product from "../model/Product";

export const addToCart = async (req, res) => {
  const { username, productId } = req.body;
  try {
    const user = await User.findOne({ username });
    console.log(user);
    const cartItem = {
      productId,
    };
    user.cart.push(cartItem);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to cart." });
  }
};

export const getCartProducts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartProducts = user.cart.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: cartProducts } });

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get cart products" });
  }
};

export const deleteCartProduct = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();

    return res.status(200).json({ message: "Product deleted from cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete cart product" });
  }
};
