const mongoose = require("mongoose")

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db

    // Projects collection indexes
    await db.collection("projects").createIndex({ featured: 1 })
    await db.collection("projects").createIndex({ createdAt: -1 })
    await db.collection("projects").createIndex({ status: 1 })
    await db.collection("projects").createIndex({ technologies: 1 })

    // Contacts collection indexes
    await db.collection("contacts").createIndex({ createdAt: -1 })
    await db.collection("contacts").createIndex({ read: 1 })
    await db.collection("contacts").createIndex({ email: 1 })

    // Users collection indexes
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })

    console.log("✅ Database indexes created successfully")
  } catch (error) {
    console.error("❌ Error creating indexes:", error.message)
  }
}

module.exports = { createIndexes }
