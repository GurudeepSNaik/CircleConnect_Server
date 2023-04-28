const connection = require("../../config/connection.js");

module.exports = {
  get: function (req, res) {
    let { industry = null } = req.body;
    try {
      if (industry) {
        connection.query(
          `SELECT * FROM industry WHERE industry='${industry}';`,
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
                    message: "Industries Retrived Successfully",
                    industries: result,
                  });
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "No Industries Found",
                  });
                }
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No Industries Found",
                });
              }
            }
          }
        );
      } else {
        connection.query(
          `SELECT * FROM industry;`,
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
                    message: "Industries Retrived Successfully",
                    industries: result,
                  });
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "No Industries Found",
                  });
                }
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No Industries Found",
                });
              }
            }
          }
        );
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  add: function (req, res) {
    let { industry } = req.body;
    try {
      if (industry) {
        if (typeof industry === "string") {
          const query = `INSERT INTO industry (industry, status)
              SELECT '${industry}', 1
              WHERE NOT EXISTS (SELECT industry FROM industry WHERE industry = '${industry}');
              SELECT industryId, industry FROM industry WHERE industry = '${industry}';`;
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
                message: "Industry Added Successfully",
                result: results[1],
              });
            }
          });
        } else if (Array.isArray(industry)) {
          const query = `
                INSERT INTO industry (industry, status)
                SELECT * FROM (
                    ${industry
                      .map((each, i) => {
                        if (i === 0) {
                          return `SELECT '${each}' AS industry, 1 AS status`;
                        } else {
                          return ` SELECT '${each}', 1`;
                        }
                      })
                      .join(" UNION ALL")}
                ) AS tmp
                WHERE NOT EXISTS (SELECT industry FROM industry WHERE industry = tmp.industry);
                SELECT industryId, industry FROM industry WHERE industry IN (${industry
                  .map((each) => `'${each}'`)
                  .join(", ")});
            `;
          connection.query(query, (err, results) => {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              const industry = results[1];
              res.status(200).json({
                status: 1,
                message: "Industries Added Successfully",
                result: industry,
              });
            }
          });
        } else {
          res.status(201).json({
            status: 0,
            message: "Please enter a Valid Field Field must be Array Or String",
          });
        }
      } else {
        res.status(201).json({
          status: 0,
          message: "Please enter all the field",
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
