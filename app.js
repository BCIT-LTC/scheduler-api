require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const cors = require('cors');
const port = 8000;
const hostname = "0.0.0.0";
const overrideMethod = require("method-override");

const app = express();
const logger = require('./logger')(module);

app.use(bodyParser.json());
app.use(cors());
app.use(overrideMethod("_method"));

const announcements = require("./routes/announcements");
const auth = require("./routes/auth");
const calendar = require("./routes/calendar");
const pdf = require("./routes/lab_guidelines");
const faq = require("./routes/faq");
const contact = require('./routes/contact'); // Import the new contact route file

app.use(express.urlencoded({extended: true}));

// Define an API route for viewing the logs
app.get('/log', (req, res) => {
  // Query the logger for the latest log entries
  logger.query({ order: 'desc', limit: 100 },
    (err, results) => {
      if (err) {

        // If an error occurs, send an
        // error response
        res.status(500).send({
          error: 'Error retrieving logs'
        });
      } else {

        // If successful, send the log 
        // entries as a response
        res.send(results);
      }
    });
});

app.use("/", announcements, auth, calendar, faq, pdf, contact);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Scheduler-API",
      version: "dev",
      description: "Welcome to the API for the BSN Openlab Scheduler",
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use("/api", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(port, hostname, () => {
  // console.log(`Server started on port ${port}`);
  logger.info(`scheduler-api started on port ${port}`);
});

module.exports = app;
