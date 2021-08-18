const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//name, photo, mail, password, passwordConfirm

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Mail is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Not a valid email'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Password is required'],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    select: false,
    required: [true, 'Confirm Password is required'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords must match!',
    },
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  forgotPassword: String,

  passwordResetToken: String,
  passwordResetExpires: Date,
  photo: {
    type: String,
    default: 'default.jpg',
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//INSTANCE METHOD...METHOD AVAILABLE FOR ALL SCHEMA
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
//DOCUMENT MIDDLEWARE
userSchema.pre('save', async function (next) {
  //Checking changes in password field
  if (!this.isModified('password')) return next();

  // Hashing the password for storing in database
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});

//Query MIDDLEWARE
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }).select('-passwordChangedAt -__v');
  next();
});

// Updates Timestamp whenever password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
