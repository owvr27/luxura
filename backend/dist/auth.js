import argon2 from 'argon2';
export async function hashPassword(pw) {
    return argon2.hash(pw);
}
export async function verifyPassword(hash, pw) {
    return argon2.verify(hash, pw);
}
