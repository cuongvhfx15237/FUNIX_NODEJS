const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app=express();
const User = require('./src/models/user');
const covidInfo = require('./src/models/covidInfo');
const staffRouter=require('./src/Routers/Staff')
const covidInfoRouter = require('./src/Routers/covidInfo');

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
app.use('/', staffRouter)
app.use('/', covidInfoRouter)


mongoose.connect('mongodb+srv://cuongvhfx15237:adminitration@cuongvhfx15237.k0pn0dz.mongodb.net/Assigment_1?retryWrites=true&w=majority')
.then(result => {
    User.findOne()
    .then(user => {
        if(!user){
            const user = new User({
                name: 'Suzy',
                doB: "10/10/1994",
                salaryScale: 2,
                startDate: "13/01/2016",
                department: "Marketing",
                annualLeave: 9,
                Image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/6/7/1053851/Suzy-.jpg"
            });
            user.save();

        }
    })

    console.log('Connect: !!!');
    app.listen(3000);
})