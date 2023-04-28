const connection = require("../../config/connection.js");

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
      profile = req.files[0].filename,
      education,
      experience,
      certificate = "",
    } = req.body;
    try {
      experience = JSON.parse(experience);
      if (
        dateofbirth &&
        fullname &&
        accountnumber &&
        bankname &&
        tn_rn &&
        userId &&
        about &&
        profile &&
        education &&
        experience
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
              id = industry.find((each) => each.industry === exp.industry);
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
                const query = `INSERT INTO profile (dob, fullName, accountNumber, bankName,tn_rn,userId,createdAt,updatedAt,status,about,profilePic)
                          SELECT "${dateofbirth}", "${fullname}", "${accountnumber}","${bankname}","${tn_rn}","${userId}",NOW(),NOW(),1,"${about}","${profile}"
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
                      message: "Profile Added Successfully",
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
  get: function (req, res) {
    try {
      const { userId } = req.body;
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
  edit: function (req, res) {
    let {
      dateofbirth = null,
      fullname = null,
      accountnumber = null,
      bankname = null,
      tn_rn = null,
      userId = null,
      about = null,
      profile = req.files[0] && req.files[0].filename || null,
      education = null,
      experience = null,
      certificate = null,
    } = req.body;
    try {
      if (userId) {
        experience = JSON.parse(experience);
        const query = `
          UPDATE profile
          SET
          ${dateofbirth ? `dob = '${dateofbirth}',`:""}
          ${fullname ? `fullName = '${fullname}',`:""}
          ${accountnumber ? `accountNumber = '${accountnumber}',`:""}
          ${bankname ? `bankName = '${bankname}',`:""}
          ${tn_rn ? `tn_rn = '${tn_rn}',`:""}
          ${about ? `about = '${about}',`:""}
          ${profile ? `profilePic = '${profile}',`:""}
            updatedAt = NOW()
            WHERE userId=${userId};

          ${
            (education || certificate) ?
            `UPDATE qualification
            SET 
              ${education ? `education = '${education}',`:""}
              ${certificate ? `certificate = '${certificate}',`:""}
              updatedAt = NOW()
              WHERE userId=${userId};`:""
          }
              
          ${
            experience && experience.length > 0 ?
            experience
              .map((data) => {
                const { years = null, industry = null,experienceId=null } = data;
                if(experienceId){
                  return `
                  UPDATE experience
                  SET 
                    ${years ? `noy = '${years}',`:""}
                    updatedAt = NOW()
                    WHERE experienceId = ${experienceId};
  
                  UPDATE industry
                  SET 
                    ${industry ? `industry = '${industry}',`:""}
                    updatedAt = NOW()
                    WHERE industryId = (
                    SELECT industry FROM experience WHERE experienceId = ${experienceId}
                    );
                  `;
                }else{
                  return "";
                }
              })
              .join(" "):""
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
              message: "Profile Updated Successfully",
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
