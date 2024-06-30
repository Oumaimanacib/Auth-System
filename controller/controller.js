const User = require("../models/usersModule.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({ status: "ko", message: "Missing information" });
    }
    let hashedPassword = bcrypt.hashSync(password, 10);
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({ status: "ko", message: "User already exist" });
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return res.json({ status: "ko", message: "User not created" });
    }
    res.json({ status: "ok", user });
  } catch (error) {
    res.status(500).json({
      status: "ko",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ status: "ko", message: "User not found" });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({ status: "ko", message: "Password or email not valid" });
  }
  const token = jwt.sign(
    { name: user.name, idUser: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    .json({ status: "ok", user });
};

const getUser = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.json({ status: "ko", message: "Users not found" });
  }
  res.json({ status: "ok", users });
};

const getUserById = async (req, res) => {
  const { idUser } = req.params;
  const user = await User.findById(idUser);
  if (!user) {
    return res.json({ status: "ko", message: "User not found" });
  }
  res.json({ status: "ok", user });
};

const deleateUser = async (req, res) => {
  const idUser = req.params.id;
  const user = await User.findByIdAndDelete(idUser);
  if (!user) {
    return res.json({ status: "ko", message: "User not deleted" });
  }
  res.json({ status: "ok", user });
};

const updateUser = async (req, res) => {
  const idUser = req.params.id;
  const { username, email, password } = req.body;
  const user = await User.updateOne(
    { _id: idUser },
    { username, email, password }
  );
  if (!user) {
    return res.json({ status: "ko", message: "User not updated" });
  }
  res.json({ status: "ok", user });
};

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({ status: "ok", message: "User logout" });
};

module.exports = {
  registerUser,
  getUser,
  getUserById,
  deleateUser,
  loginUser,
  logoutUser,
  updateUser,
};
