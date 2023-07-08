const connection = require("../../config/connection");
const executeQuery = async (query) => {
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return results;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = executeQuery;
