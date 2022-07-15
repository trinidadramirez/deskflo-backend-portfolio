const { verifyJwt } = require("../helpers/jwtHelper");
const { getJwtToken, deleteJwtToken } = require("../helpers/redisHelper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);

  // Check validity of jwt
  const decodedToken = await verifyJwt(authorization);
  console.log(decodedToken);

  if (decodedToken.email) {
    const userId = await getJwtToken(authorization);
    console.log(userId);

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
