const express = require('express');
const router = express.Router();

// Placeholder variable to store the contact message
let contactMessage =
  'For any questions related to the Open Lab Application or general use of Open Lab, please contact jasica_munday@BCIT.ca. For any other inquiries (e.g. clinical skills) please contact your clinical instructor.';

// GET contact message
router.get('/contact', (req, res) => {
  res.json({message: contactMessage});
});

// POST contact message
router.post('/contact', (req, res) => {
  const {message} = req.body;

  // Update the contact message
  contactMessage = message;

  res.json({success: true, message: 'Contact message updated successfully.'});
});

module.exports = router;
