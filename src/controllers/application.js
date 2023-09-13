const connection = require("../../config/connection.js");
const executeQuery = require("../utils/executeQuery.js");
const { notifyCompanyForApplication, notifyApplicantForJobAcceptence } = require("../utils/notification.js");
const queries = require("../utils/queries.js");

module.exports = {
  apply: async function (req, res) {
    try {
      const { jobId, userId, coverletter } = req.body;
      if (jobId && userId && coverletter) {
        const query = `select userId from job where jobId=${jobId}`;
        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            const query = `INSERT INTO application (coverletter, applicationjobId, applicationuserId, applicationownerId) VALUES ('${coverletter}', ${jobId}, ${userId}, ${result[0].userId});`;
            connection.query(query, async (err, result) => {
              if (err) {
                console.log(err);
                res.status(201).json({
                  status: 0,
                  message: err.message,
                });
              } else {
                await notifyCompanyForApplication(jobId, userId,result.insertId);
                res.status(200).json({
                  status: 1,
                  message: result,
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  getApplicants: function (req, res) {
    let {
      length = 10,
      page = 1,
      sortBy = "createdAt",
      sortType = "ascending",
      userId = false,
    } = req.query;
    try {
      if (userId) {
        length = parseInt(length);
        page = parseInt(page);
        let skip = (page - 1) * length;
        let sortOrder = sortType === "descending" ? "DESC" : "ASC";

        const query = `
          SELECT 
          application.id AS applicationId,
          application.coverletter,
          application.applicationjobId,
          application.applicationuserId,
          application.applicationownerId,
          user.name AS username,
          user.email AS useremail,
          user.type AS usertype,
          user.mobile AS usermobile,
          user.city AS usercity,
          user.province AS userstate,
          user.country AS usercountry,
          profile.profilePic as userProfilePic,
          job.companyName AS jobcompanyname,
          job.location AS joblocation,
          job.dressCode AS jobdresscode,
          job.noa AS jobnumberofapplicants,
          job.fixedCost AS jobfixedcost,
          job.variableCost AS jobvariablecost,
          job.tnc AS jobtermsandconditions,
          job.requiredSkill AS jobrequiredskill,
          job.minExp AS jobminexp,
          job.jobType AS jobtype,
          job.popular AS jobpopular,
          job.description AS jobdescription
          FROM application
          JOIN user ON application.applicationuserId = user.userId
          JOIN job ON application.applicationjobId = job.jobId
          JOIN profile ON application.applicationuserId = profile.userId
          WHERE application.applicationownerId = ${userId}
          AND application.rejected != ${1}
          AND application.accepted != ${1}
          ORDER BY application.${sortBy} ${sortOrder}
          LIMIT ${length} OFFSET ${skip};
        `;
        const countQuery = `
          SELECT COUNT(*) AS totalCount
          FROM application
          WHERE application.applicationownerId = ${userId}
          AND application.rejected != ${1}
          AND application.accepted != ${1};
        `;

        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            connection.query(countQuery, (countErr, countResult) => {
              if (countErr) {
                console.log(countErr);
                res.status(201).json({
                  status: 0,
                  message: countErr.message,
                });
              } else {
                const totalCount = countResult[0].totalCount;
                res.status(200).json({
                  status: 1,
                  message: "Applicants retrieved successfully",
                  list: result,
                  count: result.length,
                  totalCount: totalCount,
                  from: skip,
                  to: skip + length,
                  page: page,
                });
              }
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is required",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  getAcceptedApplicants: function (req, res) {
    let {
      length = 10,
      page = 1,
      sortBy = "createdAt",
      sortType = "ascending",
      userId = false,
    } = req.query;
    try {
      if (userId) {
        length = parseInt(length);
        page = parseInt(page);
        let skip = (page - 1) * length;
        let sortOrder = sortType === "descending" ? "DESC" : "ASC";

        const query = `
          SELECT 
          application.id AS applicationId,
          application.coverletter,
          application.applicationjobId,
          application.applicationuserId,
          application.applicationownerId,
          user.name AS username,
          user.email AS useremail,
          user.type AS usertype,
          user.mobile AS usermobile,
          user.city AS usercity,
          user.province AS userstate,
          user.country AS usercountry,
          profile.profilePic as userProfilePic,
          job.companyName AS jobcompanyname,
          job.location AS joblocation,
          job.dressCode AS jobdresscode,
          job.noa AS jobnumberofapplicants,
          job.fixedCost AS jobfixedcost,
          job.variableCost AS jobvariablecost,
          job.tnc AS jobtermsandconditions,
          job.requiredSkill AS jobrequiredskill,
          job.minExp AS jobminexp,
          job.jobType AS jobtype,
          job.popular AS jobpopular,
          job.description AS jobdescription
          FROM application
          JOIN user ON application.applicationuserId = user.userId
          JOIN job ON application.applicationjobId = job.jobId
          JOIN profile ON application.applicationuserId = profile.userId
          WHERE application.applicationownerId = ${userId}
          AND application.accepted = ${1}
          ORDER BY application.${sortBy} ${sortOrder}
          LIMIT ${length} OFFSET ${skip};
        `;
        const countQuery = `
          SELECT COUNT(*) AS totalCount
          FROM application
          WHERE application.applicationownerId = ${userId}
          AND application.accepted = ${1};
        `;

        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            connection.query(countQuery, (countErr, countResult) => {
              if (countErr) {
                console.log(countErr);
                res.status(201).json({
                  status: 0,
                  message: countErr.message,
                });
              } else {
                const totalCount = countResult[0].totalCount;
                res.status(200).json({
                  status: 1,
                  message: "Accepted Applicants retrieved successfully",
                  list: result,
                  count: result.length,
                  totalCount: totalCount,
                  from: skip,
                  to: skip + length,
                  page: page,
                });
              }
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is required",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  getRejectedApplicants: function (req, res) {
    let {
      length = 10,
      page = 1,
      sortBy = "createdAt",
      sortType = "ascending",
      userId = false,
    } = req.query;
    try {
      if (userId) {
        length = parseInt(length);
        page = parseInt(page);
        let skip = (page - 1) * length;
        let sortOrder = sortType === "descending" ? "DESC" : "ASC";

        const query = `
          SELECT 
          application.id AS applicationId,
          application.coverletter,
          application.applicationjobId,
          application.applicationuserId,
          application.applicationownerId,
          user.name AS username,
          user.email AS useremail,
          user.type AS usertype,
          user.mobile AS usermobile,
          user.city AS usercity,
          user.province AS userstate,
          user.country AS usercountry,
          profile.profilePic as userProfilePic,
          job.companyName AS jobcompanyname,
          job.location AS joblocation,
          job.dressCode AS jobdresscode,
          job.noa AS jobnumberofapplicants,
          job.fixedCost AS jobfixedcost,
          job.variableCost AS jobvariablecost,
          job.tnc AS jobtermsandconditions,
          job.requiredSkill AS jobrequiredskill,
          job.minExp AS jobminexp,
          job.jobType AS jobtype,
          job.popular AS jobpopular,
          job.description AS jobdescription
          FROM application
          JOIN user ON application.applicationuserId = user.userId
          JOIN job ON application.applicationjobId = job.jobId
          JOIN profile ON application.applicationuserId = profile.userId
          WHERE application.applicationownerId = ${userId}
          AND application.rejected = true
          ORDER BY application.${sortBy} ${sortOrder}
          LIMIT ${length} OFFSET ${skip};
        `;
        const countQuery = `
          SELECT COUNT(*) AS totalCount
          FROM application
          WHERE application.applicationownerId = ${userId}
          AND application.rejected = 1;
        `;

        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            connection.query(countQuery, (countErr, countResult) => {
              if (countErr) {
                console.log(countErr);
                res.status(201).json({
                  status: 0,
                  message: countErr.message,
                });
              } else {
                const totalCount = countResult[0].totalCount;
                res.status(200).json({
                  status: 1,
                  message: "Rejected Applicants retrieved successfully",
                  list: result,
                  count: result.length,
                  totalCount: totalCount,
                  from: skip,
                  to: skip + length,
                  page: page,
                });
              }
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is required",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  approveorreject: function (req, res) {
    try {
      const { applicationId = false, accepted } = req.body;
      if (applicationId) {
        let query;
        if (accepted === true) {
          query = `UPDATE application SET accepted = true,rejected = false WHERE id = ${applicationId};`;
        }
        if (accepted === false) {
          query = `UPDATE application SET accepted = false,rejected = true WHERE id = ${applicationId};`;
        }
        query += `SELECT applicationjobId
        FROM application
        WHERE id = ${applicationId};`;
        if (query) {
          connection.query(query, (err, result) => {
            if (err) {
              console.log(err);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              const jobId = result[1][0].applicationjobId;
              const query = `SELECT COUNT(*) AS applicationCount
              FROM application
              WHERE applicationjobId = ${jobId} AND accepted = 1;`;
              connection.query(query, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(201).json({
                    status: 0,
                    message: err.message,
                  });
                } else {
                  const numberOfApplicants = result[0].applicationCount;
                  const query = `UPDATE job
                  SET status = 0
                  WHERE noa <= ${numberOfApplicants};`;
                  connection.query(query, async(err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(201).json({
                        status: 0,
                        message: err.message,
                      });
                    } else {
                     if(accepted) await notifyApplicantForJobAcceptence(applicationId);
                      res.status(200).json({
                        status: 1,
                        message: "Success",
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          res.status(201).json({
            status: 0,
            message: "Either accepted or rejected must be true",
          });
        }
      } else {
        res.status(201).json({
          status: 0,
          message: "Application Id is Required",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  getApplicationWithApplicantDetails: function (req, res) {
    let { applicationId = false } = req.query;
    try {
      if (applicationId) {
        const query = `
          SELECT 
          application.id AS applicationId,
          application.coverletter,
          application.applicationjobId,
          application.applicationuserId,
          application.applicationownerId,
          user.name AS username,
          user.email AS useremail,
          user.type AS usertype,
          user.mobile AS usermobile,
          user.city AS usercity,
          user.province AS userstate,
          user.country AS usercountry,
          user.firebaseId AS userfirebaseId,
          job.companyName AS jobcompanyname,
          job.location AS joblocation,
          job.dressCode AS jobdresscode,
          job.noa AS jobnumberofapplicants,
          job.fixedCost AS jobfixedcost,
          job.variableCost AS jobvariablecost,
          job.tnc AS jobtermsandconditions,
          job.requiredSkill AS jobrequiredskill,
          job.minExp AS jobminexp,
          job.jobType AS jobtype,
          job.popular AS jobpopular,
          job.description AS jobdescription
          FROM application
          JOIN user ON application.applicationuserId = user.userId
          JOIN job ON application.applicationjobId = job.jobId
          WHERE application.id = ${applicationId}
          AND application.rejected != ${1};
        `;

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
              message: "Application retrieved successfully",
              list: result[0],
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "applicationId is required",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  getApplications: async function (req, res) {
    let {
      length = 10,
      page = 1,
      sortBy = "createdAt",
      sortType = "ascending",
      search = false,
    } = req.query;
    try {
      length = parseInt(length);
      page = parseInt(page);
      let skip = (page - 1) * length;
      let sortOrder = sortType === "descending" ? "DESC" : "ASC";
      if (search === "" || search === "false") search = false;
      let query;
      if (search) {
        query = queries.GET_APPLICATIONS_WITH_SORTBY_SORTORDER_LENGTH_SKIP(
          sortBy,
          sortOrder,
          length,
          skip,
          search
        );
      } else {
        query = queries.GET_APPLICATIONS_WITH_SORTBY_SORTORDER_LENGTH_SKIP(
          sortBy,
          sortOrder,
          length,
          skip
        );
      }
      const result = await executeQuery(query);
      res.status(200).json({
        status: 1,
        message: "Applications retrieved successfully",
        list: result,
      });
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  recentApplicants: async function (req, res) {
    let {
      length = 10,
      page = 1,
      sortBy = "createdAt",
      sortType = "ascending",
      userId = false,
    } = req.query;
    try {
      if (userId) {
        length = parseInt(length);
        page = parseInt(page);
        let skip = (page - 1) * length;
        let sortOrder = sortType === "descending" ? "DESC" : "ASC";
        const query = queries.GET_RECENT_APPLICANT_WITH_OWNER_ID(
          userId,
          length,
          skip,
          sortBy,
          sortOrder
        );
        const countQuery = queries.COUNT_RECENT_APPLICANT_WITH_OWNER_ID(userId);
        const recentapplicants = await executeQuery(query);
        const countrecentapplicants = await executeQuery(countQuery);
        const totalcount = countrecentapplicants[0].totalCount;
        res.status(200).json({
          status: 1,
          message: "Applicants retrieved successfully",
          list: recentapplicants,
          count: recentapplicants.length,
          totalCount: totalcount,
          from: skip,
          to: skip + length,
          page: page,
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is required",
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
