const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")
const { authenticateToken, isAdmin } = require("../middleware/auth")
const { validateContact, validateMongoId } = require("../middleware/validation")

// Submit contact form (public)
router.post("/", validateContact, async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()

    res.status(201).json({ message: "Message sent successfully!" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all contact messages (admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, read } = req.query
    const query = {}

    if (read !== undefined) {
      query.read = read === "true"
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Contact.countDocuments(query)

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark contact as read (admin only)
router.patch("/:id/read", authenticateToken, isAdmin, validateMongoId(), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" })
    }
    res.json(contact)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete contact message (admin only)
router.delete("/:id", authenticateToken, isAdmin, validateMongoId(), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" })
    }
    res.json({ message: "Contact deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
