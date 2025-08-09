const express = require('express');
const app = express();
const path = require('path')
const cookie = require('cookie-parser');
const ConnectedDB = require('./config/mongoose-connection');
const userRouter = require('./routes/userRoutes');
const cors = require('cors')

ConnectedDB();
require('dotenv').config();
// ✅ Allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookie());
app.set('view engine','ejs');
app.use(express.json())
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'public')));
app.use('/users',userRouter);

module.exports = app;