import argon2 from 'argon2';

export const hashPassword = (password) => argon2.hash(password);

export const verifyPassword = (passwordHash, password) =>
    argon2.verify(passwordHash, password);