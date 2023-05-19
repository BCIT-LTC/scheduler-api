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
 *      summary: Edit an faq
 *      tags: [faqs]
 *      consumes:
 *       - application/json
 *      parameters:
 *      - in: body
 *        name: question
 *        required: true
 *      - in: body
 *        name: answer
 *        required: true
 *       responses:
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

router.get("/api/faq", async (req, res) => {
  if (!auth.authenticateToken(req, false)) return res.sendStatus(403);
  try {
    const faq = await getFaq();
    return res.status(200).send(faq);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

//endpoint for adding or editing faqs
router.post("/api/faq", async (req, res) => {
  if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
  let question = req.body.question;
  let answer = req.body.answer;
  try {
    const faq = addFaq(question, answer);
    res.status(200).send(faq);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//endpoint for deleting faqs
router.delete("/api/faq", async (req, res) => {
  if (!auth.authenticateToken(req, true)) return res.sendStatus(403);
  let id = req.body.id;
  try {
    await deleteFaq(id);
    return res.status(200).send({ message: "Success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

//endpoint for editing faqs
router.put("/api/faq", async (req, res) => {
  let id = req.body.id;
  let question = req.body.question;
  let answer = req.body.answer;
  try {
    await editFaq(id, question, answer);
    return res.status(200).send({ message: "Success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
