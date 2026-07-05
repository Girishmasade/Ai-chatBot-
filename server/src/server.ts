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
import cors from "cors";
import { allowedCorsType } from "./config/cors.config.js";


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedCorsType.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
    },
  })
);


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

