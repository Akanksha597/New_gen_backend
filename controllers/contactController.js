const Contact = require("../models/Contact");

// CREATE Contact
exports.createContact = async (req, res) => {
  try {
    console.log("Incoming contact request:", req.body);

    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      console.warn("Missing required fields in contact request.");
      return res.status(400).json({
        success: false,
        message: "name, email, subject, and message are required."
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    const savedContact = await newContact.save();

    console.log("Contact saved successfully:", savedContact._id);
    res.status(201).json({ success: true, data: savedContact });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log(`Retrieved ${contacts.length} contacts.`);
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching contact with ID:", id);

    const contact = await Contact.findById(id);
    if (!contact) {
      console.warn("Contact not found for ID:", id);
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Error fetching contact by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// DELETE contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting contact with ID:", id);

    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      console.warn("Contact not found for deletion:", id);
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    console.log("Contact deleted successfully:", deletedContact._id);
    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
