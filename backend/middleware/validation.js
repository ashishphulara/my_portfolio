const { validateProjectData, validateContactData, validateObjectId } = require("../utils/validation")

const validateProject = (req, res, next) => {
  const errors = validateProjectData(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors })
  }
  next()
}

const validateContact = (req, res, next) => {
  const errors = validateContactData(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors })
  }
  next()
}

const validateMongoId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName]
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID format" })
    }
    next()
  }
}

module.exports = {
  validateProject,
  validateContact,
  validateMongoId,
}
