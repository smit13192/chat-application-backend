import mongoose from "mongoose";
import { DB_CONNECT } from "../config/config";

export function connectDatabase() {
    mongoose.connect(DB_CONNECT).then(() => {
        console.log("Database connect successfully 😂😂");
    }).catch((e) => {
        console.log(`Error:- ${e}`);
    });
}