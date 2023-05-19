/**
 * @swagger
 * tags:
 *   name: guidelilnes
 *   description: endpoint for getting and setting lab guidelines pdf
 * /api/admin:
 *   get:
 *     summary: get blob of pdf
 *     tags: [guidelilnes]
 *     responses:
 *       200:
 *         description: Pdf blob returned
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Sets the new pdf
 *     tags: [guidelilnes]
 *     consumes:
 *      - multipart/form-data
 *     parameters:
 *      - in: form
 *        required: true
 *        name: pdfFile
 *        type: file
 *     responses:
 *       200:
 *         description: pdf updated successfully
 *       500:
 *         description: Some server error
 */
const express = require("express");
const router = express.Router();
const auth = require("../middleware/checkAuth");

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/api/labGuidelines", function (req, res) {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
    try {
        var filePath = path.join(__dirname, '..', 'uploads', 'labguidelines.pdf');
        if (fs.existsSync(filePath)) {
            var file = fs.createReadStream(filePath);
            var stat = fs.statSync(filePath);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=labguidelines.pdf');
            file.pipe(res);
        }
    } catch (error) {
        console.log(error);
    }
});


router.post("/api/labGuidelines", upload.single('pdfFile'), function (req, res) {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }
    const file = req.file;
    const filePath = path.join(__dirname, '..', 'uploads', 'labguidelines.pdf');
    fs.writeFileSync(filePath, file.buffer);
    res.status(200).send({ error: "" });
});

module.exports = router;
