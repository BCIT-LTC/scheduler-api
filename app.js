// Loading environment variables
require('dotenv').config()

// Dependencies
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('path');
const cors = require('cors');
// App configurations
const port = 8000;
const hostname = "0.0.0.0";
const app = express();
const logger = require('./logger')(module);

// Middleware for authentication
const authentication_check = require("./middleware/authentication_check");

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
const userAdminRoutes = require('./routes/userAdminRoutes');

// Middleware for parsing URL-encoded data (extended: true allows parsing of arrays and objects)
app.use(express.urlencoded({ extended: true }));

// Endpoint to retrieve logs
app.get('/log', (req, res) => {
  logger.query({ order: 'desc', limit: 100 }, (err, results) => {
    if (err) {
      logger.error({message:'Log Retrieval', error: err.stack});
      res.status(500).send({ error: 'Error retrieving logs' });
    } else {
      res.send(results);
    }
  });
});

// Using route files
app.use("/api", authentication_check, announcements, auth, calendar, faq, pdf, contact);
app.use('/api', userAdminRoutes);
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
  res.json({ version: process.env.VERSION });
})

// Starting the server
app.listen(port, hostname, () => {
  logger.info(`scheduler-api started on port ${port}`);
});


module.exports = app;
