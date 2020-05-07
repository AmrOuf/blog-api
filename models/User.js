const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const util = require('util');

const jwtSecret = 'asdvajsdfhga';
const signJWT = util.promisify(jwt.sign);
const verifyJWT = util.promisify(jwt.verify);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 15,
      trim: true,
      required: [true, 'First name is required!'],
    },
    lastName: {
      type: String,
      maxlength: 15,
      trim: true,
      required: [true, 'Last name is required!'],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Email is required!'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required!'],
    },
    // there will be an array of blogs as well
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'authorId',
});

userSchema.methods.generateToken = function () {
  const currentDocument = this;
  return signJWT({ id: currentDocument.id }, jwtSecret, { expiresIn: '1h' });
};

userSchema.statics.getUserFromToken = async function (token) {
  // const User = this;
  const { id } = await verifyJWT(token, jwtSecret);
  const user = await User.findById(id);
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
