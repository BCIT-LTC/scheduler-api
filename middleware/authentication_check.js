var jwt = require('jsonwebtoken');
const logger = require('../logger')(module);

const authentication_check = (req, res, next) => {
  let token;
  // Check if the token is in the authorization header
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch {
    logger.error(`Token missing from Authorization header`);
    return res.status(400).send({ error: "Token missing from Authorization header" });
  }

  // Check if the token is valid
  try {
    const verified_token_user = jwt.verify(token, process.env.JWT_AUTH_SIGNING_KEY); // verifies and decodes the token
    res.locals.user = verified_token_user;  // res.locals.user to pass user data to the next middleware
    next(); // Token is valid, continue
    logger.debug(`Authentication successful`);
  } catch (err) {
    logger.error(`Token invalid: ${err.message}`);
    return res.status(400).send({ error: "Token invalid" });
  }
}

module.exports = authentication_check;