require("dotenv").config();
const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  res.send("test")
});

router.get("*", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  return res.redirect('/');
});

module.exports = router;
