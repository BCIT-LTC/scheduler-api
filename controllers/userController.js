const userModel = require("../models/userModel").userModel;
const bcrypt = require("bcryptjs");

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email).catch(err => console.error(err));

  if (user) {
    const checkPassword = await isUserValid(user, password);
    if (checkPassword) {
      return user;
    }
  }
  return null;
};

const getUser = async (id) => {
  let user = await userModel.findById(id).catch(err => console.error(err));
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};


module.exports = {
  getUserByEmailIdAndPassword,
  getUser,
};


