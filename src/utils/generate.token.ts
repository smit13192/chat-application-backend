import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";

export function generateToken(id: string): string {
  return jwt.sign({ id }, SECRET_KEY);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, SECRET_KEY);
}
