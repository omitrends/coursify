require('dotenv').config()//. env import hote hyane
console.log(process.env.MONGO_URL)//process.env ne print hot 
const express = require("express");//
const mongoose = require("mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();//express cha app bnavla 

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',  // Local frontend development
  'https://coursify-frontend.onrender.com', // Production frontend
  'https://coursify-frontend-9ihy.onrender.com' // Add your actual Render frontend URL
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS blocked origin:', origin);
      return callback(null, true); // Still allow for debugging, can be changed to false later
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());//body la parse karta he middle ware

// Health check route
app.get("/", (req, res) => {
    res.status(200).send("Server is running!");
});

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use("/api/v1/user", userRouter);//apan jar "api/v1/user" la route kela ki userRouter cha function chjalnar
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
    });
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    const port = process.env.PORT || 3000; // Use Render's port or 3000 locally
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
}

main()