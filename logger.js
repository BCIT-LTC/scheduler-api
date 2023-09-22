const path = require('path');
const winston = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, json } = format;

// Return the last folder name in the path and the calling
// module's filename.
const getLabel = function(callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//       format: winston.format.simple()
//   }));
// }

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