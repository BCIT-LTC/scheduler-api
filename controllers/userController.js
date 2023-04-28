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
// function ifAdmin(user) {
//   return new Promise((resolve, reject) => {
//     if (user.isAdmin === "1") {
//       // set admin to true, true means that the user is an admin
//       var userPriv;
//       userPriv = true;
//       resolve(userPriv);
//     } else if (user.isAdmin === "0") {
//       // false means that its a regular user
//       userPriv = false;
//       resolve(userPriv);
//     }
//   });
// } 

module.exports = {
  getUserByEmailIdAndPassword,
  getUser,
};


