const path = require('path');
const winston = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, json } = format;

/**
 * Retrieve the directory name and filename of the calling module.
 *
 * @param {Object} callingModule - The module invoking the logger.
 * @returns {string} - Directory and filename.
 */
const getLabel = function (callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};


const developmentTransport = new winston.transports.Console({
  level: 'debug',
  format: winston.format.simple()
});

const productionTransport = new winston.transports.Console({
  level: 'info',
  format: combine(
    timestamp(),
    label({ label: getLabel(module) }),
    json())
});

const transport = process.env.NODE_ENV === 'production' ? [productionTransport] : [developmentTransport];

/**
 * Creates a custom logger instance for the calling module.
 *
 * @param {Object} callingModule - The module invoking the logger.
 * @returns {Object} - Customized winston logger instance.
 */
module.exports = function (callingModule) {
  return new winston.createLogger({
    transports: transport
  });
};