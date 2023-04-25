const connection = require("../../config/connection.js");
const {Country,State,City} = require('country-state-city');

module.exports = {
adduser:async function(req,res){
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
  connection.query(`Insert into user(name,email,type,mobile,password,city,createdAt,updatedAt,status,pin,verified,country,province) values("${username}","${email}","${type}","${mobile}","${password}","${city}", NOW(), NOW(),1,"${pin}",${0},"${country}","${province}");`,
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
          message:"user added successfully!",
        });
      }
    })
  }else{
    res.status(201).json({
      status: 0,
      message: "Email is repeated",
    });
  }
})
},
getuser:async function(req,res){
  connection.query('Select * from user', function (err, result) {
    if (err) {
        console.log(err.message)
        res.status(201).json({
            status: 0,
            message: err.message
        })
    } else {
        res.status(200).json({
            status: 1,
            message: 'user list retrieved successfully!',
            list: result
        })
    }
});
},
country:async function(req,res){
try {
    const countries=Country.getAllCountries().map(country => ({name:country.name,code:country.isoCode}));
    res.status(200).json({
        status: 1,
        message:countries,
      });
} catch (error) {
    console.log(error.message)
    res.status(201).json({
        status: 0,
        message: error.message,
      });
}    
},
provisions:async function(req,res){
    try {
        const {countryCode}=req.body
        const country = Country.getCountryByCode(countryCode);
        if (country) {
          const province= State.getStatesOfCountry(country.isoCode).map(state => ({name:state.name,code:state.isoCode}));
          res.status(200).json({
            status: 1,
            message:province,
          });
        } else {
          res.status(201).json({
                status: 0,
                message:"Invalid Country Name",
          });
        }
    } catch (error) {
        console.log(error.message)
        res.status(201).json({
            status: 0,
            message: error.message,
          });
    } 
},
city:async function(req,res){
    try {
        const {provinceCode,provinceName}=req.body
        const state = State.getStateByCode(provinceCode);
        console.log(provinceCode,state)
        if (state) {
          const city= City.getCitiesOfState(state.isoCode).map(city =>({name:city.name,code:city.isoCode}));
          res.status(200).json({
            status: 1,
            message:city,
          });
        } else {
          res.status(201).json({
                status: 0,
                message:"Invalid State Name",
          });
        }
    } catch (error) {
        console.log(error.message)
        res.status(201).json({
            status: 0,
            message: error.message,
          });
    } 
}
};
