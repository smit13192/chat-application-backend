import { json, urlencoded } from "body-parser";
import { PORT } from "./config/config";
import { connectDatabase } from "./database";
import router from "./router";
import { app, server } from "./socket";

connectDatabase();
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(router);

server.listen(PORT, () => {
    console.log(`Server start port on ${PORT} 🚀🚀`);
});