const jwt = require("jsonwebtoken");

const generateAccessJWT = (payload) => {
  const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "20m",
  });

  return Promise.resolve(accessToken);
};

const generateRefreshJWT = (payLoad) => {
  const refreshToken = jwt.sign({ payLoad }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "20m",
  });

  return Promise.resolve(refreshToken);
};

module.exports = {
  generateAccessJWT,
  generateRefreshJWT,
};
