const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserViaEmail,
} = require("../model/user/userModel");
const { hashPassword, comparePassword } = require("../helpers/bcryptHelper");

router.all("/", (req, res, next) => {
  //res.json({ message: "Return from user router" });
  next();
});

// New user sign-up router
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPwd = await hashPassword(password);
    const newUserObj = {
      name,
      email,
      password: hashedPwd,
    };
    const result = await insertUser(newUserObj);
    console.log(result);
    res.json({ message: "new user created", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// User sign-in router
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid entry/entries :(" });
  }

  // Get user from db with email address
  const user = await getUserViaEmail(email);
  const passwordViaDb = user && user._id ? user.password : null;

  if (!passwordViaDb) {
    return res.json({ status: "error", message: "Invalid entry/entries :(" });
  }

  const result = await comparePassword(password, passwordViaDb);
  console.log(result);

  res.json({ status: "success", message: "Logged in successfully" });
});

module.exports = router;
