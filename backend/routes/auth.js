const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Register (admin only - for initial setup)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true, // First user is admin
    })

    await user.save()

    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" },
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
