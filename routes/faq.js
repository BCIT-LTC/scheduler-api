/**
 * @swagger
 * components:
 *   schemas:
 *     faqs:
 *       type: object
 *       required:
 *         - faqs_id
 *         - question
 *         - answer
 *       properties:
 *         faqs_id:
 *           type: integer
 *           description: The auto-generated id of the faq
 *         question:
 *           type: string
 *           description: The title of the faq
 *         answer:
 *           type: string
 *           description: The description of the faq
 *       example:
 *         faqs_id: 1
 *         question: What is open lab?
 *         answer: Open lab is a place where BSN students can practice their psychomotor skills
 */

/**
 * @swagger
 * tags:
 *   name: faqs
 *   description: The faqs managing API
 * /api/faq:
 *   get:
 *     summary: Retrieve the faqs
 *     tags: [faqs]
 *     responses:
 *       200:
 *         description: The list of faqs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/faqs'
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Update or add faqs
 *     tags: [faqs]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: question
 *        required: true
 *      - in: body
 *        name: answer
 *        required: true
 *     responses:
 *       200:
 *         description: Faq that was added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/faqs'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Remove an annoucement
 *     tags: [faqs]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: id
 *        required: true
 *     responses:
 *       200:
 *         description: Faq is delete
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Edit an faq
 *     tags: [faqs]
 *     consumes:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: question
 *        required: true
 *      - in: body
 *        name: answer
 *        required: true
 *     responses:
 *       200:
 *         description: Faq is edited
 *       500:
 *         description: Some server error
 *
 */

const express = require("express");
const router = express.Router();
const { getFaq, addFaq, deleteFaq, editFaq } = require("../models/faqs");
const auth = require("../middleware/checkAuth");
const createLogger = require('../logger'); // Ensure the path is correct
const logger = createLogger(module);


// FAQ ROUTES

// Endpoint to retrieve all FAQs
/**
 * GET /api/faq
 * Returns a list of all FAQs in the system.
 */
router.get("/api/faq", async (req, res) => {
    if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
    try {
        const faq = await getFaq();
        return res.status(200).send(faq);
    } catch (error) {
        logger.error({message:"/api/faq GET", error: error.stack});
        return res.status(500).send({ error: error.message });
    }
});

// Endpoint for adding or editing FAQs
/**
 * POST /api/faq
 * Add a new FAQ or edit an existing one.
 */
router.post("/api/faq", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);

    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).send({ error: "Question and answer fields are required." });
    }

    try {
        const faq = await addFaq(question, answer);
        res.status(200).send(faq);
    } catch (error) {
        logger.error({message:"/api/faq POST", error: error.stack});
        res.status(500).send({ error: error.message });
    }
});

// Endpoint for deleting FAQs
/**
 * DELETE /api/faq
 * Delete an FAQ using its ID.
 */
router.delete("/api/faq", async (req, res) => {
    if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
    const { id } = req.body;

    if (!id) {
        return res.status(400).send({ error: "FAQ ID is required." });
    }

    try {
        await deleteFaq(id);
        return res.status(200).send({ message: "Success" });
    } catch (error) {
        logger.error({message:"/api/faq DELETE", error: error.stack})
        return res.status(500).send({ error: error.message });
    }
});

// Endpoint for editing FAQs
/**
 * PUT /api/faq
 * Edit an FAQ's question and answer using its ID.
 */
router.put("/api/faq", async (req, res) => {
    const { id, question, answer } = req.body;

    if (!id || !question || !answer) {
        return res.status(400).send({ error: "ID, question, and answer fields are required." });
    }

    try {
        await editFaq(id, question, answer);
        return res.status(200).send({ message: "FAQ updated successfully." });
    } catch (error) {
        logger.error({message:"/api/faq PUT", error: error.stack})
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;
