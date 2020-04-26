// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016

import bcrypt from 'bcrypt';

export const wrapAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const hashPassword = (rawPassword: string) =>
  bcrypt.hash(rawPassword, parseInt(process.env.TIMEIT_CRYPT_ROUNDS));
