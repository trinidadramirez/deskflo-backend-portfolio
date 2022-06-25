const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

client.on('error', (err) => console.log('Redis Client Error', err));

const setJwtToken = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getJwtToken = (key) => {
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteJwtToken = key => {
  try {
    client.del(key);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setJwtToken,
  getJwtToken,
  deleteJwtToken,
};
