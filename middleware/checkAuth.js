module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    //res.redirect("/");
    res.redirect("/login");
  },

  // forwardAuthenticated: function (req, res, next) {
  //   if (!req.isAuthenticated()) {
  //     return next();
  //   }
  //   //res.redirect("/dashboard");
  // },

  checkNotAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  },

  /*isAdmin: function() {
    
  },*/
  //check if the user is admin in the database
  // isAdmin: function(req,res,next) {
  //   if(req.user.isAdmin === "1") {
  //     // set admin to true, true means that the user is an admin
  //     var userPriv
  //     userPriv = true
  //     return next();

  // }
 //  set admin to false
  // else if (req.user.isAdmin === "0"){
  //   // false means that its a regular user
  //   userPriv = false
  //   return next();
  // }
   
}

