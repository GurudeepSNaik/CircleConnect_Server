const jwt = require("jsonwebtoken");

const config = process.env;

const user = (req, res, next) => {

  let token = req.header("Authorization");
  if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).json({ msg: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports=user;