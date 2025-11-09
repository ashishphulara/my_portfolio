const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

dotenv.config()

const User = require("../models/User")
const Project = require("../models/Project")

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Project.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const adminUser = new User({
      username: "admin",
      email: "admin@portfolio.com",
      password: hashedPassword,
      isAdmin: true,
    })
    await adminUser.save()
    console.log("Created admin user")

    // Create sample projects
    const sampleProjects = [
      {
        title: "E-Commerce Platform",
        description: "Full-stack MERN application with payment integration and admin dashboard",
        longDescription:
          "A comprehensive e-commerce solution built with React, Node.js, Express, and MongoDB. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and an admin dashboard for inventory management.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "JWT"],
        githubUrl: "https://github.com/username/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.vercel.app",
        featured: true,
        status: "completed",
      },
      {
        title: "Real-time Chat Application",
        description: "WebSocket-based chat application with rooms and real-time messaging",
        longDescription:
          "A modern chat application supporting multiple chat rooms, real-time messaging, user presence indicators, and message history. Built with Socket.io for real-time communication and Redis for session management.",
        technologies: ["Socket.io", "Express", "React", "Redis", "MongoDB"],
        githubUrl: "https://github.com/username/chat-app",
        liveUrl: "https://chat-app-demo.vercel.app",
        featured: true,
        status: "completed",
      },
      {
        title: "DevOps CI/CD Pipeline",
        description: "Automated deployment pipeline with Docker, Kubernetes, and monitoring",
        longDescription:
          "A complete DevOps solution featuring automated testing, containerization with Docker, orchestration with Kubernetes, continuous integration with Jenkins, and comprehensive monitoring with Prometheus and Grafana.",
        technologies: ["Docker", "Kubernetes", "Jenkins", "AWS", "Prometheus", "Grafana"],
        githubUrl: "https://github.com/username/devops-pipeline",
        featured: true,
        status: "completed",
      },
    ]

    await Project.insertMany(sampleProjects)
    console.log("Created sample projects")

    console.log("✅ Database seeded successfully!")
    console.log("Admin credentials: username: admin, password: admin123")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await mongoose.connection.close()
  }
}

seedData()
