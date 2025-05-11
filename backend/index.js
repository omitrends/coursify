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
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://coursify-frontend.vercel.app', 'https://coursify-git-main-your-username.vercel.app', 'https://coursify.vercel.app'],
    credentials: true
}));

app.use(express.json());//body la parse karta he middle ware


app.use("/api/v1/user", userRouter);//apan jar "api/v1/user" la route kela ki userRouter cha function chjalnar
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("listening on port 3000")
}

main()