const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const cors = require("cors");
const port = 8000;
const overrideMethod = require('method-override')

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(overrideMethod('_method'))

const announcements = require("./routes/announcements");
const auth = require("./routes/auth");
const calendar = require("./routes/calendar");

app.use(express.urlencoded({ extended: true }));

app.use("/", announcements, auth, calendar);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scheduler-API",
      version: "dev",
      description:
        "Welcome to the API for the BSN Openlab Scheduler",
    },
    servers: [
      {
        url: "http://localhost:8000",
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
  console.log(`Server started on port ${port}`);
});


