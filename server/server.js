const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./db/conn");
const router = require("./routers/routers");
const SaleRoutes = require("./routers/saleRoutes");
const InvoiceRoutes = require("./routers/invoiceRoutes");
const staffRoutes = require("./routers/userRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const authRoutes = require('./routers/authRoutes');

const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true, // 🔥 required for cookies, auth headers
};

app.use(cors(corsOptions));


app.use(express.json());


// Routes
app.use("/api", router);
app.use('/api', SaleRoutes);
// app.use('/api', InvoiceRoutes);

app.use('/api', staffRoutes);
// app.use('/api', customerRoutes);
app.use('/api/auth', authRoutes);



// // Routes
// app.get("/", (req, res) => res.send("Welcome to the Rehmat Textile API"));

// app.use(errorMiddleware);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
