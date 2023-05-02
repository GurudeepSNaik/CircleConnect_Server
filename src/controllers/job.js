const connection = require("../../config/connection.js");

module.exports = {
  search: function (req, res) {
    let { search, sortBy = "mostrelevent" } = req.body;
    try {
      if (search) {
        connection.query(
          `SELECT j.*, i.industry
          FROM job j
          JOIN industry i ON j.category = i.industryId
          WHERE i.industry LIKE '%${search}%' 
            OR j.companyName LIKE '%${search}%'
            OR j.requiredSkill LIKE '%${search}%'
            OR j.jobType LIKE '%${search}%'
            OR j.location LIKE '%${search}%'
            ${search === "popular" ? "OR j.popular = 1" : ""}
          ;`,
          async function (err, result) {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              if (result.length > 0) {
                result = result.sort(
                  (a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime)
                );
                if (sortBy === "popular")
                  result = result.sort((a, b) => b.popular - a.popular);
                if (result) {
                  res.status(200).json({
                    status: 1,
                    message: "Jobs Retrived Successfully",
                    job: result,
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
        const query =
          `SELECT j.*, i.industry
          FROM job j
          JOIN industry i ON j.category = i.industryId`;
        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            res.status(200).json({
              status: 1,
              message: "Jobs Retrieved Successfully",
              list: result,
            });
          }
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  add: function (req, res) {
    let {
      category,
      companyName,
      location,
      dressCode,
      dateAndTime,
      noa,
      fixedCost,
      variableCost,
      tnc,
      requiredSkill,
      minExp,
      userId,
      jobType,
      popular,
      description = "",
    } = req.body;
    try {
      if (
        category &&
        companyName &&
        location &&
        dressCode &&
        dateAndTime &&
        noa &&
        fixedCost &&
        variableCost &&
        tnc &&
        requiredSkill &&
        minExp &&
        userId &&
        jobType &&
        popular
      ) {
        const query = `Select * from user where userId =${userId}`;
        connection.query(query, (err, result) => {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            if (result[0] && result[0].type) {
              const type = result[0].type.toUpperCase();
              if (type === "ADMIN" || type === "JOB POSTER") {
                const query = `INSERT INTO job (category, companyName, location, dressCode, dateAndTime, noa, fixedCost, variableCost, tnc, requiredSkill, minExp, userId, jobType, popular, description,createdAt,updatedAt,status)
                               VALUES (${category},'${companyName}','${location}','${dressCode}','${dateAndTime}',${noa},'${fixedCost}','${variableCost}','${tnc}','${requiredSkill}','${minExp}',${userId},'${jobType}',${popular},'${description}',NOW(),NOW(),1);`;
                connection.query(query, (err, results) => {
                  if (err) {
                    console.log(err.message);
                    res.status(201).json({
                      status: 0,
                      message: err.message,
                    });
                  } else {
                    res.status(200).json({
                      status: 1,
                      message: "Job Added Successfully",
                    });
                  }
                });
              } else {
                res.status(201).json({
                  status: 0,
                  message: "Your Role Must be either Admin Or a Job Poster",
                });
              }
            } else {
              res.status(201).json({
                status: 0,
                message: "Invalid User Id",
              });
            }
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
