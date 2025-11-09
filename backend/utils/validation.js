const mongoose = require("mongoose")

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}

const validateProjectData = (data) => {
  const errors = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required")
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push("Description is required")
  }

  if (data.githubUrl && !validateUrl(data.githubUrl)) {
    errors.push("Invalid GitHub URL")
  }

  if (data.liveUrl && !validateUrl(data.liveUrl)) {
    errors.push("Invalid live URL")
  }

  if (data.imageUrl && !validateUrl(data.imageUrl)) {
    errors.push("Invalid image URL")
  }

  return errors
}

const validateContactData = (data) => {
  const errors = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required")
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Valid email is required")
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.push("Message is required")
  }

  if (data.message && data.message.length > 1000) {
    errors.push("Message must be less than 1000 characters")
  }

  return errors
}

module.exports = {
  validateObjectId,
  validateEmail,
  validateUrl,
  sanitizeInput,
  validateProjectData,
  validateContactData,
}
