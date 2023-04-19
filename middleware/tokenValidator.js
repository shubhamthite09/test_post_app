require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {blackModle} = require("../modles/blacklist");

const validator = (req, res, next) => {
  console.log(req.cookies);
};

const authorization = (req, res, next) => {
    console.log(req.url,req.method);
  const allRoles = JSON.parse(fs.readFileSync("./permition.json", "utf-8"));
  if (
    req.body.role &&
    allRoles[req.body.role] &&
    allRoles[req.body.role].permitedMethod.includes(req.method)
  ) {
    next();
  } else {
    res.status(403).json({ error: `you are not authorized` });
  }
};

module.exports = { validator, authorization };
