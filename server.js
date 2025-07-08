// import express from "express"
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const errorHandler = require('./middleware/errorHandler.middleware');

const user = require("./routes/user.routes")
const auth = require("./routes/auth.routes")
const task = require("./routes/task.routes")


const app = express()


// Middleware

app.use(cors())
app.use(express.json())

app.get("/", user)
app.use("/api", auth)
app.use("/api/task", task)




// After all routes
app.use(errorHandler);


// start server
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
          console.log('✅ MongoDB connected');
        console.log(`server running at port ${PORT}`);
        
    })


}).catch((err)=>{
    console.log("an error occured", err)
})