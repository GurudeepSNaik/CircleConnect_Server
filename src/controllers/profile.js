const connection = require("../../config/connection.js");
const executeQuery = require("../utils/executeQuery.js");
const queries = require("../utils/queries.js");

module.exports = {
  add: function (req, res) {
    let {
      dateofbirth,
      fullname,
      accountnumber,
      bankname,
      tn_rn,
      userId,
      about,
      profile = req?.files[0]?.filename || "",
      education,
      experience,
      certificate = "",
      companyname,
      email,
    } = req.body;
    try {
      if (!userId) {
        return res.status(201).json({
          status: 0,
          message: "User Id is Required",
        });
      }
      const query = `SELECT type FROM user WHERE userId=${userId}`;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err.message);
          res.status(201).json({
            status: 0,
            message: err.message,
          });
        } else {
          const type = (result[0] && result[0].type) || "";
          if (type.toUpperCase() === "JOB POSTER") {
            if (
              dateofbirth &&
              companyname &&
              about &&
              fullname &&
              accountnumber &&
              bankname &&
              tn_rn &&
              userId &&
              profile
            ) {
              const query = `INSERT INTO profile (dob, fullName,userId,createdAt,updatedAt,status,about,profilePic,companyname,accountNumber,bankName,tn_rn)
              SELECT "${dateofbirth}", "${fullname}","${userId}",NOW(),NOW(),1,"${about}","${profile}","${companyname}","${accountnumber}","${bankname}","${tn_rn}"
              FROM dual 
              WHERE NOT EXISTS (
                  SELECT 1 FROM profile WHERE userId = '${userId}'
              )`;
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
                    message: "Job Poster Profile Added Successfully",
                  });
                }
              });
            } else {
              res.status(201).json({
                status: 0,
                message:
                  "Please Add All the Fields (dateofbirth, companyname, about, fullname, accountnumber, bankname, tn_rn, userId, profile)",
              });
            }
          } else if (type.toUpperCase() === "WORKER") {
            experience = JSON.parse(experience);
            if (
              fullname &&
              dateofbirth &&
              about &&
              education &&
              experience &&
              userId &&
              profile
            ) {
              const industries = experience.map((each) => each.industry);
              const query = `
                INSERT INTO industry (industry, status)
                SELECT * FROM (
                    ${industries
                      .map((each, i) => {
                        if (i === 0) {
                          return `SELECT '${each}' AS industry, 1 AS status`;
                        } else {
                          return ` SELECT '${each}', 1`;
                        }
                      })
                      .join(" UNION ALL")}
                ) AS tmp
                WHERE NOT EXISTS (
                    SELECT industry FROM industry WHERE industry = tmp.industry
                );

                SELECT industryId, industry FROM industry WHERE industry IN (${industries
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
                  experience = experience.map((exp) => {
                    id = industry.find(
                      (each) => each.industry === exp.industry
                    );
                    return { ...exp, ...id };
                  });
                  let query = "";
                  query += experience
                    .map((each) => {
                      return `INSERT INTO experience (industry, noy, userId, createdAt, updatedAt, status) 
            SELECT '${each.industryId}', '${each.years}', '${userId}', NOW(), NOW(), 1 
            FROM dual 
            WHERE NOT EXISTS (
                SELECT 1 FROM experience WHERE userId = '${userId}' AND industry = '${each.industryId}'
            );`;
                    })
                    .join(" ");
                  query += `INSERT INTO qualification (education, certificate, userId, createdAt, updatedAt, status) 
            SELECT "${education}", "${certificate}", "${userId}",NOW(),NOW(),1
            FROM dual 
            WHERE NOT EXISTS (
                SELECT 1 FROM qualification WHERE userId = '${userId}' AND education = '${education}'
            );`;
                  connection.query(query, async (err, result) => {
                    if (err) {
                      console.log(err.message);
                      res.status(201).json({
                        status: 0,
                        message: err.message,
                      });
                    } else {
                      const query = `INSERT INTO profile (dob, fullName,userId,createdAt,updatedAt,status,about,profilePic)
                          SELECT "${dateofbirth}", "${fullname}","${userId}",NOW(),NOW(),1,"${about}","${profile}"
                          FROM dual 
                          WHERE NOT EXISTS (
                              SELECT 1 FROM profile WHERE userId = '${userId}'
                          )`;
                      connection.query(query, async function (err, result) {
                        if (err) {
                          console.log(err.message);
                          res.status(201).json({
                            status: 0,
                            message: err.message,
                          });
                        } else {
                          if (email) {
                            const query = `SELECT userId FROM user WHERE email='${email}'`;
                            connection.query(query, (err, result) => {
                              if (err) {
                                console.log(err.message);
                                res.status(201).json({
                                  status: 0,
                                  message: err.message,
                                });
                              } else {
                                const repeatedUser = result[0]?.userId || "";

                                if (!repeatedUser || repeatedUser === userId) {
                                  if (!repeatedUser) {
                                    const query = `UPDATE user
                                    SET email = '${email}'
                                    WHERE userId = '${userId}';`;
                                    connection.query(query, (err, result) => {
                                      if (err) {
                                        console.log(err.message);
                                        res.status(201).json({
                                          status: 0,
                                          message: err.message,
                                        });
                                      } else {
                                        res.status(200).json({
                                          status: 1,
                                          message:
                                            "Worker Profile Added Successfully",
                                        });
                                      }
                                    });
                                  } else {
                                    res.status(200).json({
                                      status: 1,
                                      message:
                                        "Worker Profile Added Successfully",
                                    });
                                  }
                                } else {
                                  res.status(200).json({
                                    status: 1,
                                    message:
                                      "Worker Profile Added Successfully (But Email is Not Updated Due to Email is already Taken From Other User)",
                                  });
                                }
                              }
                            });
                          } else {
                            res.status(200).json({
                              status: 1,
                              message: "Worker Profile Added Successfully",
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            } else {
              res.status(201).json({
                status: 0,
                message:
                  "Please enter all the fields.(fullname, dateofbirth, about, education, experience, userId, profile)",
              });
            }
          } else {
            res.status(201).json({
              status: 0,
              message: "User is Neither Job Poster or a Worker",
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
  get: function (req, res) {
    try {
      const { userId } = req.query;
      if (userId) {
        const query = `SELECT * FROM profile WHERE userId=${userId};
                       SELECT * FROM qualification WHERE userId=${userId};
                       SELECT * FROM experience e
                      JOIN industry i ON e.industry = i.industryId
                      WHERE e.userId=${userId};`;
        connection.query(query, (err, results) => {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            const profile = {
              ...results[0][0],
              qualification: results[1],
              experience: results[2],
            };
            res.status(200).json({
              status: 1,
              message: profile,
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
  edit: async function (req, res) {
    let {
      dateofbirth = null,
      fullname = null,
      accountnumber = null,
      bankname = null,
      tn_rn = null,
      userId = null,
      about = null,
      profile = (req.files[0] && req.files[0].filename) || null,
      education = null,
      experience = null,
      certificate = null,
      username=null
    } = req.body;
    try {
      if (userId) {
        experience = JSON.parse(experience);
        const profileQuery = `SELECT COUNT(*) AS count FROM profile WHERE userId = ${userId}`;
        connection.query(profileQuery, async (err, profileResult) => {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            const profileExists = profileResult[0].count > 0;
            if (!profileExists) {
              const query = queries.CREATE_EMPTY_PROFILE_WITH_USERID(userId);
              await executeQuery(query);
            }

            if (username && userId){
              const query=`UPDATE user set name='${username}' where userId=${userId}`
              await executeQuery(query);
            }
            const query = `SELECT type FROM user WHERE userId=${userId}`;
            connection.query(query, async (err, result) => {
              if (err) {
                console.log(err.message);
                res.status(201).json({
                  status: 0,
                  message: err.message,
                });
              } else {
                const type = (result[0] && result[0].type) || "";

                if (type.toUpperCase() === "JOB POSTER") {
                  const query = `
                    UPDATE profile
                    SET
                    ${dateofbirth ? `dob = '${dateofbirth}',` : ""}
                    ${fullname ? `fullName = '${fullname}',` : ""}
                    ${
                      accountnumber ? `accountNumber = '${accountnumber}',` : ""
                    }
                    ${bankname ? `bankName = '${bankname}',` : ""}
                    ${tn_rn ? `tn_rn = '${tn_rn}',` : ""}
                    ${about ? `about = '${about}',` : ""}
                    ${profile ? `profilePic = '${profile}',` : ""}
                      updatedAt = NOW()
                      WHERE userId=${userId};`;
                  connection.query(query, (err, result) => {
                    if (err) {
                      console.log(err.message);
                      res.status(201).json({
                        status: 0,
                        message: err.message,
                      });
                    } else {
                      res.status(200).json({
                        status: 1,
                        message: "JOB POSTER Profile Updated Successfully",
                      });
                    }
                  });
                } else if (type.toUpperCase() === "WORKER") {
                  const qualificationQuery =
                    queries.CREATE_EMPTY_QUALIFICATION_WITH_USERID(userId);
                  // const experienceQuery =
                  //   queries.CREATE_EMPTY_EXPERIENCE_WITH_USERID(userId);
                  await executeQuery(qualificationQuery);
                  // await executeQuery(experienceQuery);
                  if(experience && experience.length>0){
                    const industries = experience.map((each) => each.industry);
                    const insertIndustry = `INSERT INTO industry (industry, status)
                          SELECT * FROM (${industries
                            .map((each, i) => {
                              if (i === 0) {
                                return `SELECT '${each}' AS industry, 1 AS status`;
                              } else {
                                return ` SELECT '${each}', 1`;
                              }
                            })
                            .join(" UNION ALL")}
                          ) AS tmp
                          WHERE NOT EXISTS (
                              SELECT industry FROM industry WHERE industry = tmp.industry
                          );
          
                          SELECT industryId, industry FROM industry WHERE industry IN (${industries
                            .map((each) => `'${each}'`)
                            .join(", ")});
                      `;
                    const [insertIndustryResult, industry] = await executeQuery(
                      insertIndustry
                    );
                    experience = experience.map((exp) => {
                      id = industry.find(
                        (each) => each.industry === exp.industry
                      );
                      return { ...exp, ...id };
                    });
                    let insertExperienceQuery = "";
                    insertExperienceQuery += experience
                      .map((each) => {
                        if (!each.experienceId) {
                          return `INSERT INTO experience (industry, noy, userId, createdAt, updatedAt, status) 
                  SELECT '${each.industryId}', '${each.years}', '${userId}', NOW(), NOW(), 1 
                  FROM dual 
                  WHERE NOT EXISTS (SELECT 1 FROM experience WHERE userId = '${userId}' AND industry = '${each.industryId}');`;
                        } else {
                          return "";
                        }
                      })
                      .join(" ");
  
                    await executeQuery(insertExperienceQuery);
                  }

                  const query = `
                    UPDATE profile
                    SET
                    ${dateofbirth ? `dob = '${dateofbirth}',` : ""}
                    ${fullname ? `fullName = '${fullname}',` : ""}
                    ${
                      accountnumber ? `accountNumber = '${accountnumber}',` : ""
                    }
                    ${bankname ? `bankName = '${bankname}',` : ""}
                    ${tn_rn ? `tn_rn = '${tn_rn}',` : ""}
                    ${about ? `about = '${about}',` : ""}
                    ${profile ? `profilePic = '${profile}',` : ""}
                      updatedAt = NOW()
                      WHERE userId=${userId};
            
                    ${
                      education || certificate
                        ? `UPDATE qualification
                      SET 
                        ${education ? `education = '${education}',` : ""}
                        ${certificate ? `certificate = '${certificate}',` : ""}
                        updatedAt = NOW()
                        WHERE userId=${userId};`
                        : ""
                    }
                        
                    ${
                      experience && experience.length > 0
                        ? experience
                            .map((data) => {
                              const {
                                years = null,
                                industry = null,
                                experienceId = null,
                              } = data;
                              if (experienceId) {
                                return `
                            UPDATE experience
                            SET 
                              ${years ? `noy = '${years}',` : ""}
                              updatedAt = NOW()
                              WHERE experienceId = ${experienceId};
            
                            UPDATE industry
                            SET 
                              ${industry ? `industry = '${industry}',` : ""}
                              updatedAt = NOW()
                              WHERE industryId = (
                              SELECT industry FROM experience WHERE experienceId = ${experienceId}
                              );
                            `;
                              } else {
                                return "";
                              }
                            })
                            .join(" ")
                        : ""
                    }`;
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
                        message: "Worker Profile Updated Successfully",
                      });
                    }
                  });
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "User is Neither Job Poster or a Worker",
                  });
                }
              }
            });
          }
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "userId is a Required Field.",
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
