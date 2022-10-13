const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const JWT_SECRET = 'ashjdkaskjhdasjkdhl321321312kdskdsakdk';

const getJwt = (id) => {
  return jwt.sign({ id: id }, JWT_SECRET);
};

const isAuthorized = (token) => {
  return jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) return false;
    return Admin.findOne({ _id: decoded.id }).then((admin) => {
      return Boolean(admin);
    });
  });
};

module.exports = { getJwt, isAuthorized };
