const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer')
const app = express();
require("dotenv").config();

var cors = require("cors");
var xss = require("xss-clean");
const route = require("./src/routes");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + file.originalname)
  }
})

var upload = multer({ storage: storage })
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

app.use(xss());
app.use(cors());

app.use("/auth", route.login);
app.use('/user', route.user)
app.use('/job', route.job)
app.use('/profile', upload.any() , route.profile)
// app.use('/city', route.city)
// app.use('/country', route.country)
// app.use('/education', route.education)
// app.use('/industry', route.industry)
// app.use('/province', route.province)
// app.use('/qualification', route.qualification)
// app.use('/usertype', route.usertype)



app.listen(4000, () => {
  console.log("app listening on port " + 4000);
});

const { connection } = require("./config/connection.js");