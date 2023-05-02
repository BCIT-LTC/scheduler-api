const express = require("express");
const router = express.Router();
const updateForm = require("../models/openLabForm");


router.post("/api/month", function (req, res) {
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

router.post('/updateOpenLabDay', function (req, res) {
    console.log("updateOpenLab req.body", req.body)
    updateForm.updateOpenLabDay(req.body.forms[0])
        .then((results) => {
            console.log("update open lab form results", results)
            if (results) {
                res.status(200).json({ results })
            } else {
                throw new Error("posting to update open lab form day", { cause: results })
            }
        }).catch((err) => {
            console.error("updateForm.updateOpenLabDay", err)
        })
})

module.exports = router;
