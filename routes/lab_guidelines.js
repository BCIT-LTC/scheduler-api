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

/**
 * Log the given error.
 * Errors are written to a file in development mode and are logged to the console in other environments.
 *
 * @param {string} context - Context or location where the error occurred.
 * @param {Error} error - The error that occurred.
 */
function logError(context, error) {
    const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
    if (process.env.Node_ENV === "development") {
        fs.appendFileSync("error_log.txt", errorMessage);
    } else {
        console.error(error);
    }
}

// LAB GUIDELINES ROUTES

/**
 * GET /api/labGuidelines
 * Endpoint to fetch the lab guidelines PDF.
 */
router.get
router.get("/api/labGuidelines", function (req, res) {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
    const filePath = path.join(__dirname, '..', 'uploads', 'labguidelines.pdf');
    if (!fs.existsSync(filePath)) {
        logError("/api/labGuidelines GET endpoint", new Error("Lab guidelines pdf not found"));
        return res.status(404).send({ error: "Lab guidelines PDF not found." });
    }

    try {
        const file = fs.createReadStream(filePath);
        const stat = fs.statSync(filePath);

        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=labguidelines.pdf');
        file.pipe(res);
    } catch (error) {
        logError("/api/labGuidelines GET", error);
        return res.status(500).send({ error: 'Failed to read the guidelines PDF.' });
    }
});

/**
 * POST /api/labGuidelines
 * Endpoint to upload the lab guidelines PDF.
 */

router.post("/api/labGuidelines", upload.single('pdfFile'), function (req, res) {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);

    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }

    const file = req.file;
    const filePath = path.join(__dirname, '..', 'uploads', 'labguidelines.pdf');

    try {
        fs.writeFileSync(filePath, file.buffer);
        res.status(200).send({ error: "" });
    } catch (error) {
        logError("/api/labGuidelines POST", error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
