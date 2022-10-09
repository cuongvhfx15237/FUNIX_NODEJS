const covidInfo = require('../models/covidInfo');
const User = require ('../models/user');

exports.getCovidStatus = (req, res, next) => {
    covidInfo.findOne().populate('userId').then(userCovid => {
        if(userCovid === null) {
            res.render('covidInfo', {
                requiredStatus: false
            })
        } else {
            let covidPositive = userCovid.covidPositive[0]
            if(userCovid.covidPositive.length ===1 && covidPositive === null){
                covidPositive = 'Chưa nhiễm'
            } else {
               covidPositive = userCovid.covidPositive[userCovid.covidPositive.length-1].toDateString()
            }
            res.render('covidInfo',{
                requiredStatus: true,
                name:userCovid.userId.name,
                firstInjection: userCovid.firstInjection.date.toDateString(),
                firstInjectionType: userCovid.firstInjection.type,
                secondInjection: userCovid.secondInjection.date.toDateString(),
                secondInjectionType: userCovid.secondInjection.type,
                covidPositive: covidPositive,
                tempToday: userCovid.heathHistories[userCovid.heathHistories.length-1].date.toDateString(),
                tempValue: userCovid.heathHistories[userCovid.heathHistories.length-1].temp
            })

        }
    })
};

exports.postCovidStatus = (req, res, next) => {
    const tempStatus = req.body.tempStatus;
    const firstInjection = req.body.firstInjection;
    const secondInjection = req.body.secondInjection;
    const vaccinType1 = req.body.vaccinType1;
    const vaccinType2 = req.body.vaccinType2
    const covidDate = req.body.covidDate
    covidInfo.findOne().populate('userId').then(userCovid => {
    if(!userCovid._id){
        const id = req.user._id
        const userCovid = new covidInfo (
            {
                userId: id,
                firstInjection: {
                    date: firstInjection,
                    type: vaccinType1
                }
                ,
                secondInjection:{
                    date: secondInjection,
                    type: vaccinType2
                }
                ,
                heathHistories:[{
                    date : new Date(),
                    temp : tempStatus
                }
                ],
                covidPositive: [
                    covidDate
                ],
            }
        )
        userCovid.save()
    }
    else {
        userCovid.heathHistories.push({date: new Date(), temp: req.body.tempStatus })
        if(req.body.covidDate !== null){
            userCovid.covidPositive.push(covidDate)
        }
        userCovid.save()
    }
    res.redirect('/')
})}