const connection = require("../../config/connection.js");
const executeQuery = require("../utils/executeQuery.js");
const { notifyWorkerForJob } = require("../utils/notification.js");

module.exports = {
  search: function (req, res) {
    let { search, sortBy = "mostrelevent" } = req.body;
    try {
      if (search) {
        connection.query(
          `SELECT j.*, i.industry
          FROM job j
          JOIN industry i ON j.category = i.industryId
          WHERE (i.industry LIKE '%${search}%' 
            OR j.companyName LIKE '%${search}%'
            OR j.requiredSkill LIKE '%${search}%'
            OR j.jobType LIKE '%${search}%'
            OR j.location LIKE '%${search}%'
            ${search === "popular" ? "OR j.popular = 1" : ""})
            AND j.status = 1
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
                    list: result,
                  });
                } else {
                  res.status(200).json({
                    status: 1,
                    message: "Jobs Retrived Successfully",
                    list: [],
                  });
                }
              } else {
                res.status(200).json({
                  status: 1,
                  message: "Jobs Retrived Successfully",
                  list: [],
                });
              }
            }
          }
        );
      } else {
        const query = `SELECT j.*, i.industry
          FROM job j
          JOIN industry i ON j.category = i.industryId 
          WHERE j.status = 1`;
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
      fixedCost = "",
      variableCost = "",
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
        // fixedCost &&
        // variableCost &&
        tnc &&
        requiredSkill &&
        minExp &&
        userId &&
        jobType &&
        popular
      ) {
        const query = `Select * from user where userId =${userId};
                       Select * from profile where userId = ${userId};`;
        connection.query(query, (err, result) => {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            if (result[0][0] && result[0][0].type) {
              const type = result[0][0]?.type?.toUpperCase();
              const image = result[1][0]?.profilePic || undefined;
              if(!image)return res.status(201).json({
                status: 0,
                message: "Profile Picture is Needed for Job Creation Please add profile",
              });
              if (type === "ADMIN" || type === "JOB POSTER") {
                const query = `INSERT INTO job (category, companyName, location, dressCode, dateAndTime, noa, fixedCost, variableCost, tnc, requiredSkill, minExp, userId, jobType, popular, description,createdAt,updatedAt,status, companyImage)
                               VALUES (${category},'${companyName}','${location}','${dressCode}','${dateAndTime}',${noa},'${fixedCost}','${variableCost}','${tnc}','${requiredSkill}','${minExp}',${userId},'${jobType}',${popular},'${description}',NOW(),NOW(),1,'${image}');`;
                connection.query(query, async (err, results) => {
                  if (err) {
                    console.log(err.message);
                    res.status(201).json({
                      status: 0,
                      message: err.message,
                    });
                  } else {
                    const jobId=results.insertId
                    await notifyWorkerForJob(jobId)
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
  delete: function (req, res) {
    try {
      const id = req.params.id;
      if (id) {
        const query = `
        DELETE FROM job where jobId = ${id};
        SELECT j.*, i.industry
          FROM job j
          JOIN industry i ON j.category = i.industryId;`;
        connection.query(query, async function (err, result) {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            res.status(200).json({
              status: 1,
              message: "Job Deleted successfully",
              list: result[1],
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "Id is Required",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  list: function (req, res) {
    let {
      length = 10,
      page = 1,
      sortBy = "createdAt",
      sortType = "ascending",
    } = req.query;
    try {
      length = parseInt(length);
      page = parseInt(page);
      let skip = (page - 1) * length;
      let sortOrder = sortType === "descending" ? "DESC" : "ASC";

      const query = `SELECT j.*, i.industry
        FROM job j
        JOIN industry i ON j.category = i.industryId
        WHERE j.status = 1
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${skip}, ${length}
        `;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(201).json({
            status: 0,
            message: err.message,
          });
        } else {
          const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM job WHERE status = 1`;
          connection.query(totalCountQuery, (countErr, countResult) => {
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
                message: "Jobs Retrieved Successfully",
                list: result,
                count: result.length || 0,
                totalCount: totalCount,
                from: skip,
                to: skip + length,
                page: page,
              });
            }
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
  details: function (req, res) {
    try {
      const { id } = req.query;
      if (id) {
        const jobQuery = `SELECT j.*, i.industry
                          FROM job j
                          JOIN industry i ON j.category = i.industryId
                          WHERE jobId=${id}`;

        const acceptedApplicantsQuery = `SELECT a.*,
                                          user.fullName AS userFullName,
                                          user.profilePic AS userProfilePic,
                                          owner.fullName AS ownerFullName,
                                          owner.profilePic AS ownerProfilePic,
                                          user2.name AS username,
                                          user2.firebaseId AS userfirebaseId,
                                          owner2.name AS ownername,
                                          owner2.firebaseId AS ownerfirebaseId
                                           FROM application a
                                           LEFT JOIN profile user ON a.applicationuserId = user.userId
                                           LEFT JOIN profile owner ON a.applicationownerId = owner.userId
                                           LEFT JOIN user user2 ON a.applicationuserId = user2.userId
                                           LEFT JOIN user owner2 ON a.applicationownerId = owner2.userId
                                           WHERE a.applicationjobId = ${id} AND a.accepted = 1`;

        const pendingApplicantsQuery = `SELECT a.* ,
                                          user.fullName AS userFullName,
                                          user.profilePic AS userProfilePic,
                                          owner.fullName AS ownerFullName,
                                          owner.profilePic AS ownerProfilePic,
                                          user2.name AS username,
                                          owner2.name AS ownername
                                          FROM application a
                                          LEFT JOIN profile user ON a.applicationuserId = user.userId
                                          LEFT JOIN profile owner ON a.applicationownerId = owner.userId
                                          LEFT JOIN user user2 ON a.applicationuserId = user2.userId
                                          LEFT JOIN user owner2 ON a.applicationownerId = owner2.userId
                                          WHERE a.applicationjobId = ${id} AND a.accepted = 0 AND a.rejected = 0`;

        const allApplicantsQuery = `SELECT a.*,
                                      user.fullName AS userFullName,
                                      user.profilePic AS userProfilePic,
                                      owner.fullName AS ownerFullName,
                                      owner.profilePic AS ownerProfilePic,
                                      user2.name AS username,
                                      owner2.name AS ownername
                                      FROM application a
                                      LEFT JOIN profile user ON a.applicationuserId = user.userId
                                      LEFT JOIN profile owner ON a.applicationownerId = owner.userId
                                      LEFT JOIN user user2 ON a.applicationuserId = user2.userId
                                      LEFT JOIN user owner2 ON a.applicationownerId = owner2.userId
                                      WHERE a.applicationjobId = ${id}`;

        const rejectedApplicantsQuery = `SELECT a.*,
                                          user.fullName AS userFullName,
                                          user.profilePic AS userProfilePic,
                                          owner.fullName AS ownerFullName,
                                          owner.profilePic AS ownerProfilePic,
                                          user2.name AS username,
                                          owner2.name AS ownername
                                          FROM application a
                                          LEFT JOIN profile user ON a.applicationuserId = user.userId
                                          LEFT JOIN profile owner ON a.applicationownerId = owner.userId
                                          LEFT JOIN user user2 ON a.applicationuserId = user2.userId
                                          LEFT JOIN user owner2 ON a.applicationownerId = owner2.userId
                                          WHERE a.applicationjobId = ${id} AND a.rejected = 1`;

        const reviewQuery = `SELECT a.job_review
                               FROM application a
                               WHERE a.applicationjobId = ${id} AND a.job_review IS NOT NULL`;

        const ratingQuery = `SELECT AVG(a.job_rating) AS avg_rating
                               FROM application a
                               WHERE a.applicationjobId = ${id}`;

        connection.query(
          `${jobQuery}; ${acceptedApplicantsQuery}; ${pendingApplicantsQuery}; ${allApplicantsQuery}; ${rejectedApplicantsQuery}; ${ratingQuery}; ${reviewQuery}`,
          (err, results) => {
            if (err) {
              console.log(err);
              return res.status(201).json({
                status: 0,
                message: err.message,
              });
            }

            const [
              jobResult,
              acceptedApplicants,
              pendingApplicants,
              allApplicants,
              rejectedApplicants,
              [rating],
              reviews,
            ] = results;
            return res.status(200).json({
              status: 1,
              message: "Job Retrieved Successfully",
              detail: jobResult[0],
              acceptedApplicants,
              pendingApplicants,
              allApplicants,
              rejectedApplicants,
              rating: rating?.avg_rating || 0,
              reviews,
            });
          }
        );
      } else {
        res.status(200).json({
          status: 0,
          message: "Id is a required Field",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  activeJobs: function (req, res) {
    try {
      const { userId } = req.query;
      if (userId) {
        const query = `SELECT job.*, 
        industry.industry
        FROM job
        JOIN industry ON job.category = industry.industryId
        WHERE job.jobId IN (SELECT applicationjobId FROM application WHERE accepted = 1)
        AND job.userId = ${userId}
        AND job.job_complete != 1;
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
              message: "Active Jobs Retrieved Successfully",
              list: result,
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is a required Field",
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
  inActiveJobs: function (req, res) {
    try {
      const { userId } = req.query;
      if (userId) {
        const query = `SELECT job.*, 
        industry.industry
        FROM job
        JOIN industry ON job.category = industry.industryId
        WHERE jobId NOT IN (SELECT applicationjobId FROM application WHERE Accepted = 1) AND userId = ${userId};`;
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
              message: "In Active Jobs Retrieved Successfully",
              list: result,
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is a required Field",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(201).json({
        status: 0,
        message: err.message,
      });
    }
  },
  activeJobsForWorker: function (req, res) {
    try {
      const { userId } = req.query;
      if (userId) {
        const query = `SELECT job.*, 
        industry.industry
        FROM job
        JOIN industry ON job.category = industry.industryId
        WHERE jobId IN (
            SELECT applicationjobId
            FROM application
            WHERE applicationuserId = ${userId}
                AND accepted = 1
                AND job_complete != 1
        )`;
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
              message: "Active Jobs Retrieved Successfully",
              list: result,
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is a required Field",
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
  completedJobsForWorker: async function (req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(201).json({
          status: 0,
          message: "userId Of a Worker is Required",
        });
      }
      const query = `SELECT job.*, 
      industry.industry
      FROM job
      JOIN industry ON job.category = industry.industryId
      WHERE jobId IN (
          SELECT applicationjobId
          FROM application
          WHERE applicationuserId = ${userId}
              AND job_complete = 1
      )`;
      const result = await executeQuery(query);
      return res.status(200).json({
        status: 1,
        message: "Completed Jobs Retrieved Successfully",
        list: result,
      });
    } catch (error) {
      console.log(error);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  completedJobsForJobPoster: async function (req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(201).json({
          status: 0,
          message: "userId Of a Job Poster is Required",
        });
      }
      const query = `SELECT job.*, 
      industry.industry
      FROM job
      JOIN industry ON job.category = industry.industryId
      WHERE userId  = ${userId} AND job_complete = 1`;
      const result = await executeQuery(query);
      return res.status(200).json({
        status: 1,
        message: "Completed Jobs Retrieved Successfully",
        list: result,
      });
    } catch (error) {
      console.log(error);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  completeAJob: async function (req, res) {
    try {
      const { userId, jobId } = req.body;
      if (!userId || !jobId) {
        return res.status(201).json({
          status: 0,
          message: "userId and jobId is Required, Note:user Must be a worker",
        });
      }
      const updateQuery = `UPDATE application SET job_complete = ${1} 
      WHERE applicationjobId = ${jobId} AND applicationuserId=${userId}`;

      const updateJobQuery = `UPDATE job
      SET job_complete = 1
      WHERE jobId = ${jobId}
        AND (
          SELECT COUNT(*)
          FROM application
          WHERE applicationjobId = job.jobId
            AND job_complete = 1
        ) >= noa;`;
      await executeQuery(updateQuery);
      await executeQuery(updateJobQuery);
      return res.status(200).json({
        status: 1,
        message: "Job Completed",
      });
    } catch (error) {
      console.log(error);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  rating: function (req, res) {
    try {
      const { jobId, userId, rating, review, type } = req.body;
      if (!jobId || !userId) {
        return res.status(201).json({
          status: 0,
          message: "jobId and userId is Required, Note:user Must be a worker",
        });
      }
      if (!rating || !review) {
        return res.status(201).json({
          status: 0,
          message: "Rating And Review is Required",
        });
      }
      if (!type === "JOB_RATING" || !type === "APPLICANT_RATING") {
        return res.status(201).json({
          status: 0,
          message: "Type Must Be Either JOB_RATING or APPLICANT_RATING",
        });
      }

      if (type === "JOB_RATING") {
        const updateQuery = `UPDATE application
        SET job_rating = ${rating}, job_review = "${review}"
        WHERE applicationjobId = ${jobId} AND applicationuserId=${userId}`;

        connection.query(updateQuery, (updateErr, updateResult) => {
          if (updateErr) {
            console.log(updateErr);
            return res.status(201).json({
              status: 0,
              message: updateErr.message,
            });
          }

          return res.status(200).json({
            status: 1,
            message: "Ratings and Review Updated Successfully",
            details: updateResult,
          });
        });
      }
      if (type === "APPLICANT_RATING") {
        const updateQuery = `UPDATE application
        SET applicant_rating = ${rating}, applicant_review = "${review}"
        WHERE applicationjobId = ${jobId} AND applicationuserId=${userId}`;

        connection.query(updateQuery, (updateErr, updateResult) => {
          if (updateErr) {
            console.log(updateErr);
            return res.status(201).json({
              status: 0,
              message: updateErr.message,
            });
          }

          return res.status(200).json({
            status: 1,
            message: "Ratings and Review Updated Successfully",
            details: updateResult,
          });
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
};
