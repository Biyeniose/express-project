const express = require("express");
const router = express.Router();
const { getContacts, createContact, getContact, updateContact, deleteContact } = require("../controllers/contactController");

const validateToken = require("../middleware/validateTokenHandler");
// GET use the controller
router.route("/").get(getContacts);

// POST
router.route("/").post(createContact);

// GET by id
router.route("/:id").get(getContact);

// PUT
router.route("/:id").put(updateContact);

// DELETE
router.route("/:id").delete(deleteContact);

// can also use shortcut with common routes
// router.route("/").get(getContacts).post(createContact);
// router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);


module.exports = router;
