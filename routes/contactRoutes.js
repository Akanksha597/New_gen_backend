const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.createContact);      // Create contact
router.get('/', contactController.getContacts);        // Get all contacts
router.get('/:id', contactController.getContactById);  // Get contact by ID
router.delete('/:id', contactController.deleteContact);// Delete contact

module.exports = router;
