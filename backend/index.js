const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/userRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const path = require("path");
const cors = require("cors");
const { authenticate } = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const connectToDB = require("./config/db");
dotenv.config({ path: path.resolve(__dirname, "config/.env") });

const app = express();
// Middleware
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );

  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  next();
});
app.use(bodyParser.json());
// Connect to DB

connectToDB();

// Routes
app.use("/auth", authRoutes);
app.use("/invoice", authenticate, invoiceRoutes);

// Start the server
app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
