import { app, server } from "./socket/socket.js";
import { PORT } from "./env/env.import.js";
import redisClient from "./config/redis.config.js";
import { errorHandler } from "./middlewares/globslError.middleware.js";
import { connectDb } from "./config/db.config.js";
import { RouterFile } from "./routers/index.js";
import express from "express";
import passport from "./config/passport.config.js";
import session from "express-session";
import { configCloud } from "./config/cloud.config.js";


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})

redisClient.connect()

// database config
connectDb()

// cloudinary config
configCloud();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize()); // initialize passport
// app.use(passport.session()); // initialize session

app.use(errorHandler)

app.use("/api/v1", RouterFile)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

