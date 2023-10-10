const path = require('path');
const winston = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, json } = format;

/**
 * Retrieve the directory name and filename of the calling module.
 * @param {Object} callingModule - The module invoking the logger.
 * @returns {string} - Directory and filename.
 */
const getLabel = function(callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//       format: winston.format.simple()
//   }));
// }

/**
 * Creates a custom logger instance for the calling module.
 * @param {Object} callingModule - The module invoking the logger.
 * @returns {Object} - Customized winston logger instance.
 */
module.exports = function (callingModule) {
  return new winston.createLogger({
    transports: [
            new winston.transports.File({
              filename: 'combined.log',
              format: combine(
                timestamp(),
                label({ label: getLabel(callingModule) }),
                json())
            }),
            new winston.transports.Console({
              format: combine(
                timestamp(),
                label({ label: getLabel(callingModule) }),
                json())
            })
          ]
  });
};