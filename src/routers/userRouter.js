const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserViaEmail,
  getUserViaId,
  storeRefreshJWT,
} = require("../model/user/userModel");
const { hashPassword, comparePassword } = require("../helpers/bcryptHelper");
const {
  generateAccessJWT,
  generateRefreshJWT,
} = require("../helpers/jwtHelper");
const { userAuthorization } = require("../auth/authorization");
const { deleteJwtToken } = require("../helpers/redisHelper");

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

// User sign-in router for admin console
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid email address and/or password 😐" });
  }

  if (!email.includes("admin")) {
    return res.json({ status: "error", message: "You are not authorized to use this application 😐" });
  }

  // Get user from db with email address
  const user = await getUserViaEmail(email);
  const passwordViaDb = user && user._id ? user.password : null;

  if (!passwordViaDb) {
    return res.json({ status: "error", message: "Invalid email address and/or password 😐" });
  }

  const result = await comparePassword(password, passwordViaDb);

  if (!result) {
    return res.json({ status: "error", message: "Invalid email address and/or password 😐" });
  }

  const accessToken = await generateAccessJWT(user.email, `${user._id}`);
  const refreshToken = await generateRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Logged in successfully",
    accessToken,
    refreshToken,
  });
});

// User sign-in router customer portal
router.post("/login-portal", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid email address and/or password 😐" });
  }

  // Get user from db with email address
  const user = await getUserViaEmail(email);
  const passwordViaDb = user && user._id ? user.password : null;

  if (!passwordViaDb) {
    return res.json({ status: "error", message: "Invalid email address and/or password 😐" });
  }

  const result = await comparePassword(password, passwordViaDb);

  if (!result) {
    return res.json({ status: "error", message: "Invalid email address and/or password 😐" });
  }

  const accessToken = await generateAccessJWT(user.email, `${user._id}`);
  const refreshToken = await generateRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Logged in successfully",
    accessToken,
    refreshToken,
  });
});

// Get user account router
router.get("/", userAuthorization, async (req, res) => {
  // Store id from db in constant
  const _id = req.userId;
  const userAcct = await getUserViaId(_id);

  res.json({ user: userAcct });
});

// User logout router
router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;

  // Store id from db in constant
  const _id = req.userId;

  // Delete access jwt from Redis db
  deleteJwtToken(authorization);

  // Delete refresh jwt from MongoDB
  const result = await storeRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "User logged out" });
  }

  res.json({ error: "failed", message: "User unable to log out" });
});

module.exports = router;
