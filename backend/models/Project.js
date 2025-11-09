const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
  githubUrl: {
    type: String,
    trim: true,
  },
  liveUrl: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["completed", "in-progress", "planned"],
    default: "completed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Project", ProjectSchema)
