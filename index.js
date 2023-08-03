require("dotenv").config();
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const user = require("./middleware/auth");

var cors = require("cors");
var xss = require("xss-clean");
const route = require("./src/routes");
const updatetablesinDatabase = require("./src/utils/updateTables");
const notify = require("./src/utils/notify");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

app.use(xss());
app.use(cors());
initializeApp({
  credential: applicationDefault(),
  projectId: "circlesconnect-47cf6",
});
const notifyUser=async ()=>{
  try {
    const response=await notify("Dontno","Hello There","Nothing")
    console.log(response);
  } catch (error) {
    console.log("Error:",error);
  }
}
// notifyUser();

app.use("/auth", route.login);
app.use("/user", user, route.user);
app.use("/job", user, route.job);
app.use("/industry", user, route.industry);
app.use("/profile", upload.any(), route.profile);
app.use("/application", user, upload.any(), route.application);
app.use("/settings", user, route.settings);
app.use("/logout", user, route.logout);

updatetablesinDatabase();

app.listen(4000, () => {
  console.log("app listening on port " + 4000);
});
