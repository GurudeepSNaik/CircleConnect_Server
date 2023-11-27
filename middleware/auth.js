const jwt = require("jsonwebtoken");
const queries = require("../src/utils/queries");
const executeQuery = require("../src/utils/executeQuery");

const config = process.env;

const user = async (req, res, next) => {

  let token = req.header("Authorization");
  if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).json({ msg: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    const query=queries.DATA_WITH_KEY_VALUE_TABLE("userId",decoded.id,"user");
    const user=await executeQuery(query);
    if(user[0].logged===0){
      return res.status(401).send("Invalid Token");
    }
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports=user;