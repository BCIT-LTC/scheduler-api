module.exports = {

  authenticateToken: function (req, res, next) {
    const authHeader = req.headers['authorization']
    if (typeof authHeader !== 'undefined') {
      const bearer = authHeader.split(" ")
      const bearerToken = bearer[1]
      jwt.verify(bearerToken, 'secretkey', (err, result) => {
        if (err) { res.sendStatus(403) }
        else { next() }
      })
    }
  }

}

