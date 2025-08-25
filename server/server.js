const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import routes
const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/communities");
const pickupRoutes = require("./routes/pickups");
const issueRoutes = require("./routes/issues");
const notificationRoutes = require("./routes/notifications");
const reportRoutes = require("./routes/reports");
const userRoutes = require("./routes/user");

const adminRoutes = require("./routes/admin");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To accept JSON data in the body

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/user", userRoutes);

app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
