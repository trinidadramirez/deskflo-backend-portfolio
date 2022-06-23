const express = require("express");
const router = express.Router();
const { insertUser } = require("../model/user/userModel");
const { hashPassword } = require("../helpers/bcryptHelper");

router.all("/", (req, res, next) => {
  //res.json({ message: "Return from user router" });
  next();
});

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

module.exports = router;
