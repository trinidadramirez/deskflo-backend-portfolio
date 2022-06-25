const jwt = require("jsonwebtoken");
const { setJwtToken, getJwtToken } = require("./redisHelper");
const { storeRefreshJWT } = require("../model/user/userModel");

const generateAccessJWT = async (email, _id) => {
  try {
    const accessToken = await jwt.sign(
      { email },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "20m",
      }
    );

    await setJwtToken(accessToken, _id);

    return Promise.resolve(accessToken);
  } catch (error) {
    return Promise.reject(error);
  }
};

const generateRefreshJWT = async (email, _id) => {
  try {
    const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "14d",
    });

    await storeRefreshJWT(_id, refreshToken);

    return Promise.resolve(_id, refreshToken);
  } catch {
    return Promise.reject(error);
  }
};

module.exports = {
  generateAccessJWT,
  generateRefreshJWT,
};
