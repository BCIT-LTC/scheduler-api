const express = require('express');
const router = express.Router();
const fs = require('fs');

// Placeholder variable to store the contact message
let contactMessage =
  'For any questions related to the Open Lab Application or general use of Open Lab, please contact jasica_munday@BCIT.ca. For any other inquiries (e.g. clinical skills) please contact your clinical instructor.';

/**
 * Logs error messages to a file or the console depending on the environment.
 *
 * @param {string} context - The context in which the error occurred.
 * @param {Error} error - The error object.
 */
function logError(context, error) {
  const errorMessage = `${new Date()} - Error in ${context}: ${error.message}\n`;
  if (process.env.NODE_ENV === 'development') {
    fs.appendFileSync('error_log.txt', errorMessage);
  } else {
    console.error(error);
  }
}

/**
 * GET route to retrieve the contact message.
 */
router.get('/contact', (req, res) => {
  try{
    res.json({message: contactMessage});
    } catch (error) {
    logError("/contact GET",error);
    res.status(500).send({error: 'Failed to fetch contact message.'});
    }
});

/**
 * POST route to update the contact message.
 */
router.post('/contact', (req, res) => {
  try{
    const { message } = req.body;

    // Validate the message
    if (typeof message !== 'string' || message.trim() === '') {
        return res.status(400).send({error: 'Invalid message. format'});
    }

    // Update the contact message
    contactMessage = message;

    res.json({success: true, message: 'Contact message updated successfully.'});
    } catch (error) {
    logError("/contact POST",error);
    res.status(500).send({error: 'Failed to update contact message.'});
  }
  });

module.exports = router;
