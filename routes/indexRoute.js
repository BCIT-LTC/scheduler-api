const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  isAdmin,
  checkNotAuthenticated,
} = require("../middleware/checkAuth");
const passport = require("../middleware/passport");
const jwt = require("jsonwebtoken");
const path = require("path");
const updateForm = require("../models/openLabForm");
const {
  getAnnouncement,
  addAnnouncement,
  deleteAnnouncement,
} = require("../models/announcement");
const { saveLogoutTime, logoutTime } = require("../models/logoutTime");
require("dotenv").config();

function getUserToken(email) {
  return jwt.sign({ email }, process.env.SECRET_KEY);
}

router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

router.post(
  "/api/login",
  passport.authenticate("local", {
    failureMessage: true,
  }),
  (req, res) => {
    console.log("req user", req.user, req.authInfo, req.params);
    const token = getUserToken(req.user.email);
    res
      .status(200)
      .json({ token, email: req.user.email, isAdmin: req.user.isAdmin });
    res.end();
  },
  (req, res) => {
    const logoutTime = logoutTime(req.user.email);
  }
);

router.post("/api/getMonth", function (req, res) {
  console.log(Object.keys(req));
  console.log("req.body", req.body);
  updateForm
    .findMonth(req.body.month)
    .then((results) => {
      console.log("update form results", results);
      if (results) {
        res.status(200).json({ results });
      } else {
        throw new Error("posting to update form", { cause: results });
      }
    }).catch((err) => {
      console.error("updateForm.findMonth", err)
    })
});

router.post("/api/updateCalendar", function (req, res) {
  console.log(Object.keys(req));
  console.log("req.body.forms", req.body.forms);
  updateForm
    .updateCalendar(req.body.forms)
    .then((results) => {
      console.log("update form results", results);
      if (results) {
        res.status(200).json({ results });
      } else {
        throw new Error("posting to update form", { cause: results });
      }
    }).catch((err) => {
      console.error("updateForm.updateCalendar", err)
    })
});

router.post('/updateOpenLabDay', function(req, res) {
  console.log("updateOpenLab req.body", req.body )
  updateForm.updateOpenLabDay(req.body.forms[0])
  .then((results) => {
    console.log("update open lab form results", results)
    if (results) {
      res.status(200).json({ results })
    } else {
      throw new Error("posting to update open lab form day", {cause: results})
    }
  }).catch((err) => {
    console.error("updateForm.updateOpenLabDay", err)
  })
})

// logout function
router.post('/api/logout', function(req, res, next) {
  saveLogoutTime(req.body.email, req.body.logoutTime);
  res.status(200).send();

  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

router.get("/api/announcement", async (req, res) => {
  try {
    const announcement = await getAnnouncement();

    return res.status(200).send(announcement);
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

router.post("/api/announcement", async (req, res) => {
  const getLogoutTime = await logoutTime(req.body.email)
  
  return res.status(200).send(getLogoutTime)
});

//endpoint for announcement table
router.get("/api/announcementTable", async (req, res) => {
  try {
    const announcement = await getAnnouncement();
    return res.status(200).send(announcement);
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

//endpoint for adding announcements
router.post("/api/add", async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let date = req.body.date;
  try {
    const announcement = addAnnouncement(title, description, date);
    res.status(200).send(announcement);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

//endpoint for deleting announcements
router.post("/api/delete", async (req, res) => {
  let id = req.body.id;
  try {
    await deleteAnnouncement(id);

    return res.status(200).send({ message: "Success" });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

//endpoint for editing announcements
router.post("/api/edit", async (req, res) => {
  let title = req.body.title;
  try {
    const announcement = await editAnnouncement(title);
    res.status(200).send(announcement);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

module.exports = router;
