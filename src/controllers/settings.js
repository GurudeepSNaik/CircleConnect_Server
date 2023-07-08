const connection = require("../../config/connection.js");
const executeQuery = require("../utils/executeQuery.js");
const queries = require("../utils/queries.js");

module.exports = {
  get: function (req, res) {
    let { id } = req.params;
    try {
      if (!id) {
        res.status(201).json({
          status: 0,
          message: "id in Params is Required",
        });
      }
      const query = `SELECT * FROM settings where userId=${id};`;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(201).json({
            status: 0,
            message: err.message,
          });
        } else {
          if (result.length !== 0) {
            res.status(200).json({
              status: 1,
              data: result[0],
            });
          } else {
            const query = `SELECT COUNT(*) AS count FROM user WHERE userId = ${id};`;
            connection.query(query, (err, result) => {
              if (err) {
                console.log(err);
                res.status(201).json({
                  status: 0,
                  message: err.message,
                });
              } else {
                if (result[0].count === 0) {
                  res.status(201).json({
                    status: 0,
                    message: "User Not Exist",
                  });
                } else {
                  const query = `INSERT INTO settings (location, notifications, userId) VALUES (${false}, ${false}, ${id});
                               SELECT * FROM settings where userId=${id};`;
                  connection.query(query, (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(201).json({
                        status: 0,
                        message: err.message,
                      });
                    } else {
                      const data = result[1][0];
                      res.status(200).json({
                        status: 1,
                        data: data,
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  update: function (req, res) {
    let { location = false, notifications = false, userId } = req.body;
    try {
      if (!userId) {
        return res.status(201).json({
          status: 0,
          message: "userId is a required field",
        });
      }
      const query = `INSERT INTO settings (location, notifications, userId)
        VALUES (${location}, ${notifications}, ${userId})
        ON DUPLICATE KEY UPDATE
            location = VALUES(location),
            notifications = VALUES(notifications);`;

      connection.query(query, (err, results) => {
        if (err) {
          console.log(err);
          res.status(201).json({
            status: 0,
            message: err.message,
          });
        } else {
          res.status(200).json({
            status: 1,
            message: "Settings Updated Added Successfully",
          });
        }
      });
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  // get2: async function (req, res) {
  //   try {
  //     const query = queries.COUNT_WITH_KEY_VALUE_TABLE("industryId",2,"industry");
  //     const result = await executeQuery(query);
  //     res.status(200).json({
  //       status: 1,
  //       message: result,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(201).json({
  //       status: 0,
  //       message: error.message,
  //     });
  //   }
  // },
};
