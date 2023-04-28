const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const cors = require("cors");
const port = 8080;
const overrideMethod = require('method-override')

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(overrideMethod('_method'))

// app.use(
//   session({
//     secret: "secret_value",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

const passport = require("./middleware/passport");
const indexRoute = require("./routes/indexRoute");
const announcements = require("./routes/announcements");
const { checkNotAuthenticated } = require("./middleware/checkAuth");

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoute, announcements);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scheduler-API",
      version: "dev",
      description:
        "This is the API for the BSN Openlab Scheduler",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});


