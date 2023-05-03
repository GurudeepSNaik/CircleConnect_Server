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
    if( type && username && password && mobile && email && country && province && city && pin){
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
    }else{
      res.status(201).json({
        status: 0,
        message: "Required All the Field",
      });
    }
  },
  getuser: async function (req, res) {
    const {id,search}=req.body;
    if(id){
      connection.query(`Select * from user where userId = '${id}'`,
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
    }else if(search){
      connection.query(`SELECT user.*, profile.userId AS profileUserId,profile.profileId,profile.dob,profile.fullName,profile.accountNumber,profile.bankName,profile.tn_rn,profile.about,profile.profilePic FROM user LEFT JOIN profile ON user.userId = profile.userId 
      WHERE user.name LIKE '%${search}%' 
      OR user.email LIKE '%${search}%'
      OR user.type LIKE '%${search}%'
      OR user.city LIKE '%${search}%'
      OR user.province LIKE '%${search}%'
      OR user.country LIKE '%${search}%'
      OR profile.fullName LIKE '%${search}%'`
      , function (err, result) {
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
      });   
    }else{
      connection.query("SELECT user.*, profile.userId AS profileUserId,profile.profileId,profile.dob,profile.fullName,profile.accountNumber,profile.bankName,profile.tn_rn,profile.about,profile.profilePic FROM user LEFT JOIN profile ON user.userId = profile.userId", function (err, result) {
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
      });
    }
  },

};
