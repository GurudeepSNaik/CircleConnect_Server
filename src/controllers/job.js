const connection = require("../../config/connection.js");
const { sendMail, generateRandomNumber } = require("../utils");
const { Country, State } = require("country-state-city");

let OTP = null;
module.exports = {
  search: function (req, res) {
    let {search}=req.body
    try {
      if (search) {
        connection.query(
          `SELECT * FROM job
          WHERE category LIKE '%${search}%' 
          OR companyName LIKE '%${search}%'
          OR noa LIKE '%${search}%'
          OR requiredSkill LIKE '%${search}%'
          OR jobType LIKE '%${search}%'
          OR location LIKE '%${search}%';`,
          async function (err, result) {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              if (result.length > 0) {
                if (result) {
                  res.status(200).json({
                    status: 1,
                    message: "Jobs Retrived Successfully",
                    job: result
                  });
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "No Jobs Found",
                  });
                }
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No Jobs Found",
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
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  sort:function (req,res){
    let {sortby,}=req.body
    try {
      if (search) {
        connection.query(
          `SELECT * FROM job
          WHERE category LIKE '%${search}%' 
          OR companyName LIKE '%${search}%'
          OR noa LIKE '%${search}%'
          OR requiredSkill LIKE '%${search}%'
          OR jobType LIKE '%${search}%'
          OR location LIKE '%${search}%';`,
          async function (err, result) {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              if (result.length > 0) {
                if (result) {
                  res.status(200).json({
                    status: 1,
                    message: "Jobs Retrived Successfully",
                    job: result
                  });
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "No Jobs Found",
                  });
                }
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No Jobs Found",
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
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  }
};
