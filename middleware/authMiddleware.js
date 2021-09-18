const jwt = require("jsonwebtoken");
const Account = require("../model/Account");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exist and verified
  if (token) {
    jwt.verify(token, process.env.RAHASIA, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkAccount = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.RAHASIA, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.account = null;
        next();
      } else {
        console.log(decodedToken);
        let account = await Account.findById(decodedToken.id);
        res.locals.account = account;
        next();
      }
    });
  } else {
    res.locals.account = null;
    next();
  }
};

module.exports = { requireAuth, checkAccount };
