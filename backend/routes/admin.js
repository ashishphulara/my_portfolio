const express = require("express")
const router = express.Router()
const { authenticateToken, isAdmin } = require("../middleware/auth")
const { getProjectStats, getContactStats } = require("../utils/aggregations")

// Get dashboard statistics (admin only)
router.get("/dashboard", authenticateToken, isAdmin, async (req, res) => {
  try {
    const projectStats = await getProjectStats()
    const contactStats = await getContactStats()

    res.json({
      projects: projectStats,
      contacts: contactStats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get system health (admin only)
router.get("/health", authenticateToken, isAdmin, async (req, res) => {
  try {
    const mongoose = require("mongoose")

    const dbState = mongoose.connection.readyState
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    res.json({
      database: {
        status: dbStates[dbState],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
