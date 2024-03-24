import { compareSync, hashSync } from "bcrypt";

export function hashPassword(password: string): string {
  return hashSync(password, 8);
}

export function compareHash(
  password: string,
  hashPassword: string
): boolean {
  return compareSync(password, hashPassword);
}
