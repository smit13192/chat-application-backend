import { json, urlencoded } from "body-parser";
import cors from "cors";
import morgan from 'morgan';
import { PORT } from "./config/config";
import { connectDatabase } from "./database";
import { errorMiddleware } from "./middleware/error";
import router from "./router";``
import { app, express, server } from "./socket";

connectDatabase();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));
app.use(router);
app.use(errorMiddleware);

server.listen(PORT, () => {
    console.log(`Server start port on ${PORT} 🚀🚀`);
});