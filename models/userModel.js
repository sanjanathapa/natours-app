const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on CREATE and ON SAVE
      validator: function (pswd) {
        return pswd === this.password;
      },
      message: 'Passwords are not same',
    },
  },
});

//Document middleware (Pre save hook)
userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
    if (this.password.isModified) return next();

  //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field, we do not want to save this field in DB
    this.passwordConfirm = undefined;
  next();
});


userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

//All these communication must happen over https