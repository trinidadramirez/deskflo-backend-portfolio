const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = (plainTextPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainTextPassword, saltRounds));
  });
};

module.exports = {
  hashPassword,
};
