const Account = require("../model/Account");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  // Duplicate error code
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
// createToken JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.RAHASIA, {
    expiresIn: maxAge,
  });
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.create({ email, password });
    res.status(201).json({ account: account });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const token = createToken(account._id);
    res.cookie("jwt", token, { maxAge: maxAge * 1000, secure: true });
    res.status(200).json({ account: account_id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
