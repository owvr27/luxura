import argon2 from 'argon2';
export async function hashPassword(pw: string) {
  return argon2.hash(pw);
}
export async function verifyPassword(hash: string, pw: string) {
  return argon2.verify(hash, pw);
}