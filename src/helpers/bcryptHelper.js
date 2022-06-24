const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = (plainTextPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainTextPassword, saltRounds));
  });
};

const comparePassword = (plainPassword, pwdViaDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, pwdViaDb, function (err, result) {
      if (err) reject(err);

      resolve(result);
    });
  });
};

module.exports = {
  hashPassword,
  comparePassword,
};
