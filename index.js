const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
app.use(bodyParser.json());
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')
dotenv.config();


app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(6000, ()=> console.log('starting server'));

mongoose.connect(process.env.DB_CONNECT,()=>console.log('connected to db'));

