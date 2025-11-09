const express = require("express")
const router = express.Router()
const Project = require("../models/Project")
const { authenticateToken, isAdmin } = require("../middleware/auth")
const { validateProject, validateMongoId } = require("../middleware/validation")

// Get all projects (public)
router.get("/", async (req, res) => {
  try {
    const { featured, limit, status, tech } = req.query
    const query = {}

    if (featured === "true") {
      query.featured = true
    }

    if (status) {
      query.status = status
    }

    if (tech) {
      query.technologies = { $in: [tech] }
    }

    let projectsQuery = Project.find(query).sort({ createdAt: -1 })

    if (limit) {
      projectsQuery = projectsQuery.limit(Number.parseInt(limit))
    }

    const projects = await projectsQuery
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single project (public)
router.get("/:id", validateMongoId(), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ error: "Project not found" })
    }
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new project (admin only)
router.post("/", authenticateToken, isAdmin, validateProject, async (req, res) => {
  try {
    const project = new Project(req.body)
    await project.save()
    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update project (admin only)
router.put("/:id", authenticateToken, isAdmin, validateMongoId(), validateProject, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) {
      return res.status(404).json({ error: "Project not found" })
    }
    res.json(project)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete project (admin only)
router.delete("/:id", authenticateToken, isAdmin, validateMongoId(), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ error: "Project not found" })
    }
    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
