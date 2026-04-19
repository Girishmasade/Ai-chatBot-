import { app, server } from "./socket/socket.js";
import { PORT } from "./env/env.import.js";

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.get("/", (req, res) => {
    res.send("Hello World!")
})

