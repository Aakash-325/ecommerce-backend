import User from "../model/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password, contact } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return console.log(err);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already Exists! Login instead." });
  }

  const newUser = new User({
    username: username,
    email: email,
    password: CryptoJS.AES.encrypt(password, process.env.Crypto_Key),
    contact: contact,
  });
  try {
    newUser.save();
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ newUser });
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.jwt_Key,
    { expiresIn: "10m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.jwt_Refresh_Key,
    { expiresIn: "1d" }
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.Crypto_Key
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword === password) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const { password, ...others } = user._doc;
      return res.status(200).json({ accessToken, refreshToken });
    } else {
      return res.status(401).json({ message: "Invalid credential" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Invalid credentials" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.jwt_Refresh_Key);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
