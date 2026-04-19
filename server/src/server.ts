import { app, server } from "./socket/socket.js";
import { PORT } from "./env/env.import.js";
import redisClient from "./config/redis.config.js";

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

redisClient.connect()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

