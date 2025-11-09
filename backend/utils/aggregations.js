const mongoose = require("mongoose")

const getProjectStats = async () => {
  try {
    const Project = mongoose.model("Project")

    const stats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          featuredProjects: {
            $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] },
          },
          completedProjects: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgressProjects: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
        },
      },
    ])

    const techStats = await Project.aggregate([
      { $unwind: "$technologies" },
      {
        $group: {
          _id: "$technologies",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    return {
      overview: stats[0] || {
        totalProjects: 0,
        featuredProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
      },
      topTechnologies: techStats,
    }
  } catch (error) {
    console.error("Error getting project stats:", error)
    return null
  }
}

const getContactStats = async () => {
  try {
    const Contact = mongoose.model("Contact")

    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          unreadMessages: {
            $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] },
          },
          readMessages: {
            $sum: { $cond: [{ $eq: ["$read", true] }, 1, 0] },
          },
        },
      },
    ])

    const recentMessages = await Contact.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt read")

    return {
      overview: stats[0] || {
        totalMessages: 0,
        unreadMessages: 0,
        readMessages: 0,
      },
      recentMessages,
    }
  } catch (error) {
    console.error("Error getting contact stats:", error)
    return null
  }
}

module.exports = {
  getProjectStats,
  getContactStats,
}
