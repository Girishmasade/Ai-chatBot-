import { app, server } from "./socket/socket.js";
import { PORT } from "./env/env.import.js";
import redisClient from "./config/redis.config.js";
import { errorHandler } from "./middlewares/globslError.middleware.js";

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

redisClient.connect()

app.use(errorHandler)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

