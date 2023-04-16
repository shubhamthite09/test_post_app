require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {blackModle} = require("../modles/blacklist");

const validator = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.token
  const refresh_token = req.cookies.refresh_token || req.headers.authorization.refresh_token
  jwt.verify(token, process.env.token_key, (err, decoded) => {
    if (err) {
      if (refresh_token) {
        jwt.verify(refresh_token, process.env.refresh_key, async (err, decoded) => {
          if (err) {
            res
              .status(401)
              .json({ error: `please login again your token is not valid` });
          } else {
            if (await blackModle.findOne({ token:refresh_token })) {
              res
                .status(403)
                .json({ error: `please login you are in blacklist` });
            } else {
              let token = jwt.sign(
                { id: decoded.id, role: decoded.role },
                process.env.token_key,
                { expiresIn: "1h" }
              );
              res.cookie("token", token);
              req.body.user = decoded.id;
              req.body.role = decoded.role;
              next();
            }
          }
        });
      } else {
        res
          .status(406)
          .json({ error: `please login again your token is not valid` });
      }
    } else {
      req.body.user = decoded.id;
      req.body.role = decoded.role;
      next();
    }
  });
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
