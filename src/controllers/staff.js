
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
    })

    req.user.progress.status='false'
    req.user.save().then(() => {
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
        res.redirect('/')
    }
    )
}

exports.postAnnual = (req, res, next) => {
    const annualChecks = req.body.dateAnnual.split(',')
    const annualRemain = req.user.annualLeave*8 - annualChecks.length*req.body.timeAnnual
    annualChecks.forEach(annualCheck=>{
        annualCheck = new Date(annualCheck)
        req.user.progress.annual.push({
            annualDate: annualCheck,
            annualTime: parseInt(req.body.timeAnnual),
            reason: req.body.reasonAnnual
        }
        )

    })
    req.user.annualLeave = annualRemain/8
    req.user.save().then(() => {
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
    req.user.Image=req.body.imageLink;
    req.user.save().then(()=>{
        res.redirect('info')
    })
}


exports.getSearch = (req, res, next) => {
    let salaryPerMonth = req.user.salaryScale*3000000;

    const workHistories= new Array;
        //create Date list
        let tempDate = []
        for(let i =0; i<req.user.progress.workHistory.length; i++){
            let date = req.user.progress.workHistory[i].checkin.toDateString().replace(/^\S+\s/,'')
            tempDate.push(date)
        }
        for (let i = 0; i<req.user.progress.annual.length; i++){
            let date = new Date(req.user.progress.annual[i].annualDate)
            tempDate.push(date.toDateString().replace(/^\S+\s/,''))
        }
        let dateLog = [...new Set(tempDate)]
        //create Date List
        //create workHistory Log
        let tempWorkHis = []
        let t = []

        for (let i=0; i< req.user.progress.workHistory.length-1; i++){
            if(req.user.progress.workHistory[i+1].checkin.toDateString().replace(/^\S+\s/,'') === req.user.progress.workHistory[i].checkin.toDateString().replace(/^\S+\s/,'')){
                t.push(req.user.progress.workHistory[i])
            }
            else {
                t.push(req.user.progress.workHistory[i])
                tempWorkHis.push(t)
                t=[]
            }

        }
        if ( req.user.progress.workHistory[req.user.progress.workHistory.length-1].checkin.toDateString().replace(/^\S+\s/,'')  === req.user.progress.workHistory[req.user.progress.workHistory.length-2].checkin.toDateString().replace(/^\S+\s/,'')){
            t.push(req.user.progress.workHistory[req.user.progress.workHistory.length-1])
        }
        else {
            t=[req.user.progress.workHistory[req.user.progress.workHistory.length-1]]
        }
        tempWorkHis.push(t)

                //create workHistory Log

        for(let i=0; i< dateLog.length;i++){
            let dateValue = dateLog[i];
            let workHis = new Array
            let annual = 0
            tempWorkHis.forEach(tmp => {
                if (tmp[0].checkin.toDateString().replace(/^\S+\s/,'')=== dateValue){
                    workHis = tmp
                }
            })
            req.user.progress.annual.forEach(tp=>{
                let date = new Date(tp.annualDate)
                if(date.toDateString().replace(/^\S+\s/,'') === dateValue){
                    annual = tp.annualTime
                }
            })
            let j = {date: dateValue, workHis: workHis, annual: annual}
            workHistories.push(j)
            
        }
        const array = workHistories.sort((a,b)=> {
            a.annual-b.annual
        })


    res.render('Search', {
        user:req.user,
        workHistories : workHistories, 
    })
}

// exports.getCovidInfo = (req, res, next) => {
//     console.log(req.query)
//     res.render('covidInfo')
// }
// exports.postCovidInfo = (req, res, next) => {
//     console.log(req.body)
//     res.redirect('covidInfo')
// }
// exports.getLoginInfo = (req, res, next) => {
//     res.render('Login')
// }