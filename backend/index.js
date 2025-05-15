require('dotenv').config()//. env import hote hyane
console.log(process.env.MONGO_URL)//process.env ne print hot 
const express = require("express");//
const mongoose = require("mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();//express cha app bnavla 

// Enable CORS for all routes
app.use(cors({
    origin: '*', // Allow all origins for now, adjust for production
    credentials: true
}));

app.use(express.json());//body la parse karta he middle ware

// Health check route
app.get("/", (req, res) => {
    res.status(200).send("Server is running!");
});

app.use("/api/v1/user", userRouter);//apan jar "api/v1/user" la route kela ki userRouter cha function chjalnar
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    const port = process.env.PORT || 3000; // Use Render's port or 3000 locally
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
}

main()