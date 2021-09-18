const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// fire a function before save doc in db
accountSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login account
accountSchema.statics.login = async function (email, password) {
  const account = await this.findOne({ email });
  if (account) {
    const auth = await bcrypt.compare(password, account.password);
    if (auth) {
      return account;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const Account = mongoose.model("account", accountSchema);

module.exports = Account;
