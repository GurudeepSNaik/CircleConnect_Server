let connection = require("../../config/connection.js");

module.exports = {
  login: function (req, res) {
    if (req.body.email && req.body.password) {
      connection.query(
        `Select * from user where email = '${req.body.email}'`,
        async function (err, result) {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            if (result.length > 0) {
              if (result[0]) {
                const role = {
                  1: "worker",
                  2: "job_poster",
                  3: "admin",
                };
                res.status(200).json({
                  status: 1,
                  message: "Your login was successful.",
                  role: role[result[0].type],
                  id: result[0].userId,
                });
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No User Found",
                });
              }
            } else {
              res.status(201).json({
                status: 0,
                message: "Error! Admin not found.",
              });
            }
          }
        }
      );
    } else {
      res.status(201).json({
        status: 0,
        message: "Please enter all the fields.",
      });
    }
  },
  register: async function (req, res) {
    const {
      type,
      username,
      password,
      mobile,
      email,
      country,
      province,
      city,
      pin,
    } = req.body;
    try {
      if (
        type &&
        username &&
        password &&
        mobile &&
        email &&
        country &&
        province &&
        city &&
        pin
      ) {
        connection.query(`SELECT email from user`, function (err, result) {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          }
          const response = result.filter((data) => email === data.email);
          //check for repeated email

          if (response.length === 0) {
            //check if country exist if exist take id or else create one and take id
            connection.query(
              `INSERT INTO country (country, updatedAt, createdAt, status)
        SELECT '${country.toLowerCase()}', NOW(), NOW(), 1
        WHERE NOT EXISTS (SELECT * FROM country WHERE country = '${country.toLowerCase()}');`,
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(201).json({
                    status: 0,
                    message: err.message,
                  });
                } else {
                  connection.query(
                    `SELECT * FROM country WHERE country = '${country.toLowerCase()}';`,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        res.status(201).json({
                          status: 0,
                          message: err.message,
                        });
                      } else {
                       //check if province exist if exist take id or else create one and take id
                        const countryId = result[0].countryId;
                        connection.query(
                          `INSERT INTO province (province, countryId, createdAt, updatedAt, status)
                SELECT '${province.toLowerCase()}','${countryId}', NOW(), NOW(), 1
                WHERE NOT EXISTS (SELECT * FROM province WHERE province = '${province.toLowerCase()}');`,
                          (err, result) => {
                            if (err) {
                              console.log(err);
                              res.status(201).json({
                                status: 0,
                                message: err.message,
                              });
                            } else {
                              connection.query(
                                `SELECT * FROM province WHERE province = '${province.toLowerCase()}';`,
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                    res.status(201).json({
                                      status: 0,
                                      message: err.message,
                                    });
                                  } else {
                                    //check if city exist if exist take id or else create one and take id
                                    const provinceId = result[0].provinceId;
                                    connection.query(
                                      `INSERT INTO city (city, provinceId, createdAt, updatedAt, status)
                        SELECT '${city.toLowerCase()}','${provinceId}', NOW(), NOW(), 1
                        WHERE NOT EXISTS (SELECT * FROM city WHERE city = '${city.toLowerCase()}');`,
                                      (err, result) => {
                                        if (err) {
                                          console.log(err);
                                          res.status(201).json({
                                            status: 0,
                                            message: err.message,
                                          });
                                        } else {
                                          connection.query(
                                            `SELECT * FROM city WHERE city = '${city.toLowerCase()}';`,
                                            (err, result) => {
                                              if (err) {
                                                console.log(err);
                                                res.status(201).json({
                                                  status: 0,
                                                  message: err.message,
                                                });
                                              } else {
                                                const cityId = result[0].cityId;
                                                const role = {
                                                  worker: 1,
                                                  "job poster": 2,
                                                  admin: 3,
                                                };
                                                //Insert all of them
                                                connection.query(
                                                  `Insert into user(name,email,type,mobile,password,city,createdAt,updatedAt,status,pin,verified) values("${username}","${email}",${
                                                    role[type]
                                                  },"${mobile}","${password}",${cityId}, NOW(), NOW(),1,"${pin}",${0});`,
                                                  function (err, result) {
                                                    if (err) {
                                                      console.log(err.message);
                                                      res.status(201).json({
                                                        status: 0,
                                                        message: err.message,
                                                      });
                                                    } else {
                                                      res.status(200).json({
                                                        status: 1,
                                                        message:"Employee added successfully!",
                                                      });
                                                    }
                                                  }
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          } else {
            res.status(201).json({
              status: 0,
              message: "Email is Repeated",
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "Please enter all the fields.",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
};
