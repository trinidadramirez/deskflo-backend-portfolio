const express = require("express");
const router = express.Router();
const {
  verifyRefreshJwt,
  generateAccessJWT,
} = require("../helpers/jwtHelper");
const { getUserViaEmail } = require("../model/user/userModel");

router.get("/", async (req, res, next) => {
  const { authorization } = req.headers;

  // Verify token validity
  const decodedRefreshToken = await verifyRefreshJwt(authorization);

  if (decodedRefreshToken.email) {
    const userAcct = await getUserViaEmail(decodedRefreshToken.email);

    if (userAcct._id) {
      let tokenExp = userAcct.refreshJWT.addedAt;
      const dbRefreshToken = userAcct.refreshJwt.token;

      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DATE
      );
      const currentDay = new Date();

      // Token expired. Prompt user to sign in again
      if (dbRefreshToken !== authorization && tokenExp < currentDay) {
        return res.status(403).json({ message: "Token expired. Sign-in required" });
      }
      const accessJwt = await generateAccessJWT(
        decodedRefreshToken.email,
        userAcct._id.toString()
      );
      return res.json({ status: "success", accessJwt });
    }
  }
  res.status(403).json({ message: "Token expired. Sign-in required" });
});

module.exports = router;
