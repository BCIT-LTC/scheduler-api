const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 8080;
const overrideMethod = require('method-override')

const app = express();
app.use(express.static('build'))
app.use(bodyParser.json());
app.use(cors());

app.set("view engine", "ejs"); // probably dont need this since we're using react
// app.use(express.static(path.join(__dirname, "public"))); // also probably wont need this
app.use(express.static('client/build'));

app.use(
  session({
    secret: "secret_value",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const indexRoute = require("./routes/indexRoute");
const { checkNotAuthenticated } = require("./middleware/checkAuth");

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(overrideMethod('_method'))


app.options('*', (req, res) => {
  // this is temporary for development
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.status(200)
  res.end()
})

app.use("/", indexRoute);
// app.get("/*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "/components", "announcements.js"),
//     (err) => {
//       if (err) console.log(err);
//     }
//   );
// });


app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
