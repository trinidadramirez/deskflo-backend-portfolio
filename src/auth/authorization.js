const { verifyJwt } = require("../helpers/jwtHelper");
const { getJwtToken, deleteJwtToken } = require("../helpers/redisHelper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log("Auth: " + authorization);

  // Check validity of jwt
  const decodedToken = await verifyJwt(authorization);

  if (decodedToken.email) {
    const userId = await getJwtToken(authorization);

    if (!userId) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    req.userId = userId;
    return next();
  }
  deleteJwtToken(authorization);
  return res.status(403).json({ message: "Not Authorized" });
};

module.exports = {
  userAuthorization,
};
