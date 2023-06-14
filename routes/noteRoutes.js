const express = require("express");

const noteController = require("../controllers/notesController");

const router = express.Router();

router
	.route("/")
	.get(noteController.getAllNotes)
	.post(noteController.createNewNote)
	.patch(noteController.updateNote)
	.delete(noteController.deleteNote);

module.exports = router;
