const connection = require("../../config/connection.js");

module.exports = {
  adduser: async function (req, res) {
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
          connection.query(
            `Insert into user(name,email,type,mobile,password,city,createdAt,updatedAt,status,pin,verified,country,province) values("${username}","${email}","${type}","${mobile}","${password}","${city}", NOW(), NOW(),1,"${pin}","${false}","${country}","${province}");`,
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
                  message: "user added successfully!",
                });
              }
            }
          );
        } else {
          res.status(201).json({
            status: 0,
            message: "Email is repeated",
          });
        }
      });
    } else {
      res.status(201).json({
        status: 0,
        message: "Required All the Field",
      });
    }
  },
  getuser: async function (req, res) {
    const { id, search } = req.body;
    console.log
    if (id) {
      connection.query(
        `Select * from user where userId = '${id}'`,
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
                res.status(200).json({
                  status: 1,
                  message: "user retrived successfully",
                  list: result[0],
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
                message: "No User Found",
              });
            }
          }
        }
      );
    } else if (search) {
      connection.query(
        `SELECT user.*, profile.userId AS profileUserId,profile.profileId,profile.dob,profile.fullName,profile.accountNumber,profile.bankName,profile.tn_rn,profile.about,profile.profilePic FROM user LEFT JOIN profile ON user.userId = profile.userId 
      WHERE user.name LIKE '%${search}%' 
      OR user.email LIKE '%${search}%'
      OR user.type LIKE '%${search}%'
      OR user.city LIKE '%${search}%'
      OR user.province LIKE '%${search}%'
      OR user.country LIKE '%${search}%'
      OR profile.fullName LIKE '%${search}%'`,
        function (err, result) {
          if (err) {
            console.log(err.message);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            console.log(result[0])
            res.status(200).json({
              status: 1,
              message: "user list retrieved successfully!",
              list: result,
            });
          }
        }
      );
    } else {
      connection.query(
        "SELECT user.*, profile.userId AS profileUserId,profile.profileId,profile.dob,profile.fullName,profile.accountNumber,profile.bankName,profile.tn_rn,profile.about,profile.profilePic FROM user LEFT JOIN profile ON user.userId = profile.userId",
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
              message: "user list retrieved successfully!",
              list: result,
            });
          }
        }
      );
    }
  },
  deleteuser: async function (req, res) {
    try {
      const id = req.params.id;
      if (id) {
        const query = `
        DELETE FROM job where userId = ${id};
        DELETE FROM experience where userId = ${id};
        DELETE FROM qualification where userId = ${id};
        DELETE FROM profile where userId = ${id};
        DELETE FROM user where userId = ${id};
        SELECT user.*, profile.userId AS profileUserId,profile.profileId,profile.dob,profile.fullName,profile.accountNumber,profile.bankName,profile.tn_rn,profile.about,profile.profilePic FROM user LEFT JOIN profile ON user.userId = profile.userId;`;
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
              message: "user Deleted successfully",
              list: result[5],
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
  providersJobs: async function (req, res) {
    try {
      let {
        userId,
        length = 10,
        page = 1,
        sortBy = "createdAt",
        sortType = "ascending",
      } = req.query;
      if (userId) {
        length = parseInt(length);
        page = parseInt(page);
        let skip = (page - 1) * length;
        let sortOrder = sortType === "descending" ? "DESC" : "ASC";
        const query = `SELECT j.*, i.industry
        FROM job j
        JOIN industry i ON j.category = i.industryId
        WHERE userId=${userId}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${skip}, ${length}`;
        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(201).json({
              status: 0,
              message: err.message,
            });
          } else {
            const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM job WHERE userId=${userId}`;
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
      } else {
        res.status(200).json({
          status: 0,
          message: "userId is a required Field",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  isGovtPhotVerified:async function (req,res) {
    const {id : userID} = req.params;
    console.log(userID);  

    if(!userID){
      return res.status(201).json({
        status: 0,
        message: "id is required field",
      })
    }
    const query = `SELECT govtPhotoStatus FROM user WHERE userId = ${userID}`
    connection.query(query,async (err,result) => {
        if(err){
          console.log(err.message);
          res.status(201).json({
            status: 0,
            message: err.message,
          });
        }else{
          console.log(result[0].govtPhotoStatus),"--result";
          return res.status(201).json({
            status: 1,
            message: "User status retrieved successfully!" ,
            govtPhotoStatus:!!result[0].govtPhotoStatus
          });
          
        }
    })


  },
  updateGovtPhotoStatus:async function(req,res) {
    const {id : userID,govtPhotoStatus} = req.body;
    console.log(userID);  
    if(!userID || govtPhotoStatus === null || govtPhotoStatus === undefined){
      return res.status(201).json({
        status: 0,
        message: "All fileds are required",
      })
    }
    const query = `UPDATE user SET govtPhotoStatus = ${govtPhotoStatus} WHERE userId = ${userID}`
    connection.query(query,async (err,result) => {
        if(err){
          console.log(err.message);
          res.status(201).json({
            status: 0,
            message: err.message,
          });
        }else{
          return res.status(201).json({
            status: 1,
            message: "User status updated successfully!" ,
          });
          
        }
    })
  }
};
