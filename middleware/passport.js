const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");

const localLogin = new LocalStrategy(
  { 
    usernameField: "email",
    passwordField: "password",
  },
  
  async (email, password, done) => {
    const user = await userController.getUserByEmailIdAndPassword(email, password);
    console.log('passport locallogin, what is user', user)
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.userid);
});

passport.deserializeUser(async function (id, done) {
  let user = await userController.getUser(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);
