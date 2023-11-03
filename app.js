// Loading environment variables
require('dotenv').config()

// Dependencies
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('path');
const cors = require('cors');
const fs = require('fs');

// App configurations
const port = 8000;
const hostname = "0.0.0.0";
const app = express();
const logger = require('./logger')(module);

/**
 * Function to log errors based on the environment.
 * @param {String} context - Context or source of the error.
 * @param {Error} error - The error object.
 */
function logError(context, error) {
  const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
  if (process.env.NODE_ENV === 'development') {
    fs.appendFileSync('error_log.txt', errorMessage);
  } else {
    console.error(error);
  }
}

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Routes
const announcements = require("./routes/announcements");
const auth = require("./routes/auth");
const calendar = require("./routes/calendar");
const pdf = require("./routes/lab_guidelines");
const faq = require("./routes/faq");
const contact = require('./routes/contact'); // Import the new contact route file

// Middleware for parsing URL-encoded data (extended: true allows parsing of arrays and objects)
app.use(express.urlencoded({ extended: true }));

// Endpoint to retrieve logs
app.get('/log', (req, res) => {
  logger.query({ order: 'desc', limit: 100 }, (err, results) => {
    if (err) {
      logError('Log Retrieval', err);
      res.status(500).send({ error: 'Error retrieving logs' });
    } else {
      res.send(results);
    }
  });
});

// Using route files
// app.use("/api", announcements, auth, calendar, faq, pdf, contact);
app.use("/api", announcements, auth, calendar, faq, pdf, contact);

// Swagger API documentation setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Scheduler-API",
      version: "dev",
      description: "Welcome to the API for the BSN Openlab Scheduler",
    },
    servers: [{ url: 'http://localhost:8000' }],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Swagger UI setup
// app.use("/", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200)
  res.json({ version: process.env.GIT_TAG });
})

// Starting the server
app.listen(port, hostname, () => {
  logger.info(`scheduler-api started on port ${port}`);
});

module.exports = app;
