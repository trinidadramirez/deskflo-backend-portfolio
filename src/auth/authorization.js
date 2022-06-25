const { verifyJwt } = require("../helpers/jwtHelper");
const { getJwtToken } = require("../helpers/redisHelper");

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
  return res.status(403).json({ message: "Not Authorized" });

  // Verify if jwt exists in Redis

  // Get user id

  // Get user account based on user id
};

module.exports = {
  userAuthorization,
};
