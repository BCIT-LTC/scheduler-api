const jwt = require("jsonwebtoken");
const logger = require("../logger")(module);

const authentication_check = (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch {
    logger.error(`Token missing from Authorization header`);
    return res
      .status(403)
      .send({ error: "Token missing from Authorization header" });
  }

  // Check if the token is valid
  try {
    const test_signing_key = process.env.JWT_AUTH_SIGNING_KEY;
    const verified_token_user = jwt.verify(token, test_signing_key); // verifies and decodes the token
    res.locals.user = verified_token_user; // res.locals.user to pass user data to the next middleware
    next(); // Token is valid, continue
  } catch (err) {
    logger.error(`Failed to authenticate token: ${err.message}`);
    return res.status(400).send({ error: "Failed to authenticate token" });
  }
};

module.exports = authentication_check;
