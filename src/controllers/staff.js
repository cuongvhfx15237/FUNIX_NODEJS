const User = require ('../models/user');

exports.getIndex = (req, res, next) => {
    let workHis = req.user.progress.workHistory
    const length = workHis.length
    const today = new Date()
    if (length === 0) {
        res.render('Working', {
            name: req.user.name,
            image: req.user.Image,
            workHis: workHis,
            status: req.user.progress.status,
            timeLapse:0,
            annualLeave: '',
            today: today
        })
    }
    else {
        res.render('Working', {
            name: req.user.name,
            image: req.user.Image,
            workHis: workHis,
            status: req.user.progress.status,
            annualLeave:req.user.annualLeave,
            today: today
        })
}
     
    }
exports.postCheckin = (req, res, next) => {
    const workSpace = req.body.workSpace
    const h = new Date()
    req.user.progress.workHistory.push({
        checkin: h,
        checkout:'',
        Space:workSpace,
        _id:false
    })

    req.user.progress.status='false'
    req.user.save().then(() => {
        console.log('check in')
        res.redirect('/')
    }
    )
}

exports.postCheckout = (req, res, next) => {
    const h = new Date()
    const length = req.user.progress.workHistory.length
    req.user.progress.workHistory[length -1].checkout = h;
    req.user.progress.status='true'
    req.user.save().then(() => {
        console.log('checkout')
        res.redirect('/')
    }
    )
}

exports.postAnnual = (req, res, next) => {
    const annualChecks = req.body.dateAnnual.split(',')
    const annualRemain = req.user.annualLeave*8 - annualChecks.length*req.body.timeAnnual
    annualChecks.forEach(annualCheck=>{
        req.user.progress.annual.push({
            annualDate: annualCheck,
            annualTime: req.body.timeAnnual,
            reason: req.body.reasonAnnual
        }
        )

    })
    req.user.annualLeave = annualRemain/8
    req.user.save().then(() => {
        console.log("Annual Register");
        res.redirect('/');
    })
}

//test requet code
exports.getInfo = (req, res, next) => {

    res.render('info', {
            user: req.user
        })
    }
exports.postNewImage = (req, res, next) => {
    console.log(req.body)
    req.user.Image=req.body.imageLink;
    req.user.save().then(()=>{
        res.redirect('info')
    })
}


exports.getSearch = (req, res, next) => {
    res.render('Search', {
        user:req.user
    })
}

exports.getCovidInfo = (req, res, next) => {
    res.render('covidInfo')
}

exports.getLoginInfo = (req, res, next) => {
    res.render('Login')
}