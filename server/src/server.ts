import { app, server } from "./socket/socket.js";
import { PORT } from "./env/env.import.js";
import redisClient from "./config/redis.config.js";
import { errorHandler } from "./middlewares/globslError.middleware.js";
import { connectDb } from "./config/db.config.js";
import { RouterFile } from "./routers/index.js";

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

redisClient.connect()

connectDb()

app.use(errorHandler)

app.use("/api", RouterFile)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

