const connection = require("../../config/connection.js");
const { sendMail, generateRandomNumber } = require("../utils");
const { Country, State } = require("country-state-city");

let OTP = null;
module.exports = {
  login: function (req, res) {
    let {email,password}=req.body
    try {
      if (email && password) {
        email=email.toLowerCase();
        connection.query(
          `Select * from user where email = '${email}'`,
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
                    message: "Your login was successful.",
                    role: result[0].type,
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
                  message: "Error! No User Found.",
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
  register: async function (req, res) {
    let {
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
        email=email.toLowerCase();
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
            OTP = generateRandomNumber(6);
            connection.query(
              `Insert into user(name,email,type,mobile,password,city,createdAt,updatedAt,status,pin,verified,country,province,otp) values("${username}","${email}","${type}","${mobile}","${password}","${city}", NOW(), NOW(),1,"${pin}","${false}","${country}","${province}",${OTP});`,
              function (err, result) {
                if (err) {
                  console.log(err.message);
                  res.status(201).json({
                    status: 0,
                    message: err.message,
                  });
                } else {
                  const subject = "OTP";
                  const heading = "Welcome to Circles Connect";
                  const body = `<p>${OTP} is your OTP</p>`;
                  const To = email;
                  sendMail(To, subject, heading, body);
                  res.status(200).json({
                    status: 1,
                    message: `user added successfully and otp has been sent to mail: ${email}`,
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
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  verifyotp: async function (req, res) {
    try {
      let { otp, email } = req.body;
      if (otp && email) {
        email=email.toLowerCase();
        connection.query(
          `Select * from user where email = '${email}'`,
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
                  const data=result[0];
                  if (Number(result[0].otp) === Number(otp)) {
                    connection.query(`UPDATE user SET verified = '${true}' WHERE email = '${email}';`,
                    async function (err, result) {
                      if (err) {
                        console.log(err.message);
                        res.status(201).json({
                          status: 0,
                          message: err.message,
                        });
                      } else {
                        res.status(200).json({
                          status: 1,
                          message: "Your login was successful.",
                          role: data.type,
                          id: data.userId,
                        });
                      }
                    }
                  );
                  } else {
                    res.status(201).json({
                      status: 0,
                      message: "Otp Doesn't Match",
                    });
                  }
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "No User Found",
                  });
                }
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No User to be found",
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
  resendotp: async function (req, res) {
    let { email } = req.body;
    try {
      if (email) {
        email=email.toLowerCase();
        OTP = generateRandomNumber(6);
        connection.query(`UPDATE user SET otp = ${OTP} WHERE email = '${email}';`,
          function (err, result) {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              const subject = "OTP";
              const heading = "Welcome to Circles Connect";
              const body = `<p>${OTP} is your OTP</p>`;
              const To = email;
              sendMail(To, subject, heading, body);
              res.status(200).json({
                status: 1,
                message: `user added successfully and otp has been sent to mail: ${email}`,
              });
            }
          }
        );

      } else {
        res.status(201).json({
          status: 0,
          message: `email is required`,
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  forgotpassword: async function (req, res) {
    let { email } = req.body;
    try {
      if (email) {
        email=email.toLowerCase();
        OTP = generateRandomNumber(4);
        connection.query(`UPDATE user SET otp = ${OTP} WHERE email = '${email}';`,
          function (err, result) {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              const subject = "OTP for regenerating password";
              const heading = "Welcome,";
              const body = `<p>${OTP} is your OTP for regenerating password</p>`;
              const To = email;
              sendMail(To, subject, heading, body);
              res.status(200).json({
                status: 1,
                message: `otp has been sent to mail: ${email}`,
              });
            }
          }
        );
      } else {
        res.status(201).json({
          status: 0,
          message: `email is required`,
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  verifyotpforregeneratepassword: async function (req, res) {
    try {
      let { otp, email } = req.body;
      if (otp && email) {
        email=email.toLowerCase();
        connection.query(
          `Select * from user where email = '${email}'`,
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
                  if (Number(result[0].otp) === Number(otp)) {
                    res.status(200).json({
                      status: 1,
                      message: "Otp Has been Verified you are Good to go",
                      role: result[0].type,
                      id: result[0].userId,
                    });
                  } else {
                    res.status(201).json({
                      status: 0,
                      message: "Otp Doesn't Match",
                    });
                  }
                } else {
                  res.status(201).json({
                    status: 0,
                    message: "No User Found",
                  });
                }
              } else {
                res.status(201).json({
                  status: 0,
                  message: "No User to be found",
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
  updatepassword:async function(req,res){
    try {
      let {email,password}=req.body;
      if(email && password){
        email=email.toLowerCase();
        connection.query(`UPDATE user SET password = '${password}' WHERE email = '${email}';`,
          async function (err, result) {
            if (err) {
              console.log(err.message);
              res.status(201).json({
                status: 0,
                message: err.message,
              });
            } else {
              connection.query(`SELECT * FROM user WHERE email = '${email}';`,
              async function (err, result) {
                if (err) {
                  console.log(err.message);
                  res.status(201).json({
                    status: 0,
                    message: err.message,
                  });
                } else {
                  if(result[0]){
                    res.status(200).json({
                      status: 1,
                      message: "Password Has Changed",
                      role: result[0].type,
                      id: result[0].userId,
                    });
                  }else{
                    res.status(201).json({
                      status: 0,
                      message: "No user Found",
                    });
                  }
                }
              }
            );
            }
          }
        );
      }else{
        res.status(201).json({
          status: 0,
          message: "Enter All the field",
        });
      }
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  country: async function (req, res) {
    try {
      const countries = Country.getAllCountries().map((country) => ({
        name: country.name,
        code: country.isoCode,
      }));
      res.status(200).json({
        status: 1,
        message: "Country Successfully retrived",
        list:countries,
      });
    } catch (error) {
      console.log(error.message);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  province: async function (req, res) {
    try {
      const { countryCode } = req.body;
      const country = Country.getCountryByCode(countryCode);
      if (country) {
        const province = State.getStatesOfCountry(country.isoCode).map(
          (state) => ({ name: state.name, code: state.isoCode })
        );
        
        res.status(200).json({
          status: 1,
          message: "States Successfully Retrived",
          list: province,
        });
      } else {
        res.status(201).json({
          status: 0,
          message: "Invalid Country Code",
        });
      }
    } catch (error) {
      console.log(error.message);
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  }
};
