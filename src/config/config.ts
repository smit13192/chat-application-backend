import { config } from "dotenv";

config({
    path: '.env.development'
});

export const PORT: number = parseInt(process.env.PORT || '8001');
export const DB_CONNECT: string = process.env.DB_CONNECT!;
export const SECRET_KEY: string = process.env.SECRET_KEY!;