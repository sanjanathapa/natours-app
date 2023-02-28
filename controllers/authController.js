const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_PASSWORD, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  // jwt.sign({ id: newUser._id}, process.env.JWT_PASSWORD, {
  //     expiresIn: process.env.JWT_EXPIRES_IN
  // })

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

//we always passes options as an object

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body, '------request body---------');
  const { email, password } = req.body;

  //1. check if email and passwords exist while login
  if (!email || !password) {
    return next(new AppError('please provide an email and password!!!!', 400));
  }

  //2. check if user exist && password is exist
  const user = await User.findOne({ email }).select('+password');
  console.log('---user----', user);

  //const correct = user.correctPassword(password, user.password)
  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('----', token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
    //we return from this middleware and call the next one and in next() we gonna create an error
  }
  //2. Verification token
  jwt.verify;
  //3. Check if user still exists
  //4. Check if user changed password after the token was issued
  next();
});

//send a token using a http header with the request. set headers in postman to send it along with the request.
// to send a json web token as a header. we should always use authorization key
