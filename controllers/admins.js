const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const { getJwt } = require('../helpers/jwt');

// cost
const SALT_ROUNDS = 10;

const registerAdmin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ message: 'Email and password cannot be empty' });

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    return Admin.findOne({ email })
      .then((admin) => {
        if (admin)
          return res
            .status(403)
            .send({ message: 'Пользователь с такой почтой уже существует' });
        return Admin.create({ ...req.body, password: hash })
          .then((user) => {
            return res.status(200).send(user);
          })
          .catch((err) => res.status(400).send(err));
      })
      .catch((err) => res.status(400).send({ message: 'Произошла ошибка' }));
  });
};

const authAdmin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ message: 'Email and password cannot be empty' });

  return Admin.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return res
          .status(403)
          .send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, admin.password, (error, isValidPassword) => {
        if (!isValidPassword)
          return res.status(401).send({ message: 'Пароль не верен' });

        const token = getJwt(admin.id);
        return res.status(200).send({ token });
      });
    })
    .catch(() => res.status(400).send({ message: 'произошла ошибка' }));
};

module.exports = { registerAdmin, authAdmin };
