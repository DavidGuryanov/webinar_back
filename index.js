const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRouter = require('./routes/users');
const adminsRouter = require('./routes/admins');

const { PORT = 3000 } = process.env;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/', adminsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
