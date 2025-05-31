require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./api/routes/userRoutes');
const tenderRoutes = require('./api/routes/tenderRoutes');
const offerRoutes = require('./api/routes/offerRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'tender-secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/', tenderRoutes);
app.use('/', userRoutes);
app.use('/offers', offerRoutes);

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
