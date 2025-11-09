const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const rateLimit = require("express-rate-limit")

// Load environment variables
dotenv.config()

// Import database connection
const connectDB = require("./config/database")
const { createIndexes } = require("./utils/dbIndexes")

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})

// Middleware
app.use(limiter)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Connect to MongoDB and create indexes
connectDB().then(async () => {
  await createIndexes()
})

// Import routes
const projectRoutes = require("./routes/projects")
const contactRoutes = require("./routes/contact")
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API Routes
app.use("/api/projects", projectRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
})
