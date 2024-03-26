const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization; // Make sure 'Authorization' is checked in both cases
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { // Make sure it's 'ACCESS_TOKEN_SECRET'
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      console.log(decoded)
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;