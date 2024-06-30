const express = require("express");
const router = express.Router();

const {
  registerUser,
  getUser,
  getUserById,
  deleateUser,
  loginUser,
  logoutUser,
  updateUser,
} = require("../controller/controller.js");
const auth = require("../middleware/authUser.js");

// parse application/json
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/", auth, getUser);
router.get("/:id", auth, getUserById);
router.delete("/:id", auth, deleateUser);
router.put("/:id", auth, updateUser);

module.exports = router;
