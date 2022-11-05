const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./src/models/user');
const staffRouter=require('./src/Routers/Staff')
const covidInfoRouter = require('./src/Routers/covidInfo');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./src/controllers/error');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://cuongvhfx15237:adminitration@cuongvhfx15237.k0pn0dz.mongodb.net/Assigment_1?retryWrites=true&w=majority'
const app=express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
})
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'src/public')));

app.use((req, res, next) => {
    User.findById("62ff12a6ff028b0e8b68cec0")
    .then(user =>{
            req.user = user
        next()
    })
    .catch(err => {
            console.log("error")
            console.log(err)
    })
})

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
app.use((req, res, next)=> {
    User.find().then(user=>{
        console.log(req.user)
        req.user = user
        next()
    }).catch(err=> console.log(err))
//     const user = req.user
    // res.locals.isAuthenticated = req.session.isLoggenIn;
    // res.locals.csrfToken=req.csrfToken();
    // next();
})
const authRoutes = require('./src/Routers/auth');
app.use('/', staffRouter)
app.use(covidInfoRouter)
app.use(errorController.get404);


mongoose.connect(MONGODB_URI)
.then(result => {
    console.log('Connect: !!!');
    app.listen(3000)
    })
    .catch(err => {
        console.log(err)
    })