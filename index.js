const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./src/controllers/error');
const User = require('./src/models/user');

const MONGODB_URI = 'mongodb+srv://cuongvhfx15237:adminitration@cuongvhfx15237.k0pn0dz.mongodb.net/Assigment_1?retryWrites=true&w=majority'

const app=express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => { 
    if (file.mimetype === 'image/png' || file.mimetype==='image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
  }

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const staffRouter=require('./src/Routers/Staff')
const covidInfoRouter = require('./src/Routers/covidInfo');
const authRouters = require('./src/Routers/auth');
const errorRoutes = require('./src/Routers/error')

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// app.use(multer({dest: 'images' }).single('image'));
app.use(express.static(path.join(__dirname,'src/public')));
app.use('/images',express.static(path.join(__dirname, 'src/images')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(flash())

app.use((req, res, next)=> {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id).then(user=>{
        if (!user) {
            return next();
          }
        req.user = user
        next()
    }).catch(err=> next(new Error(err)))
})


app.use('/', staffRouter)
app.use(covidInfoRouter)
app.use(authRouters)

app.use(errorRoutes);

// app.use((error, req, res, next)=> {
//     console.log(req.user)
//     res.status(500).render('500', {
//         pageTitle: "Error!",
//         path: '/500',
//         // isAuthenticated: req.session.isLoggedIn
//     })
// })

mongoose.connect(MONGODB_URI)
.then(result => {
    console.log('Connect: !!!');
    app.listen(3000)
    })
    .catch(err => {
        console.log(err)
    })