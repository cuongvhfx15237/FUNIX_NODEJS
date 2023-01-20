const mongoose = require('mongoose')
const covidInfoSchema = new mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    firstInjection:
        {
            date: {
                type: Date
            },
            type: {
                type: String
            }
        },
    secondInjection:
        {
            date: {
                type: Date
            },
            type: { 
                type: String
            }
        },
    heathHistories: [
        {
            date:{
                type: Date
            },
            temp: {
                type: Number
            },
            _id: false,
        }],

    covidPositive: [
        {
            covidStatus: {
                type: Boolean,
            },
            date: {
            type: Date
            },
            _id: false,
        }
    ]

})

module.exports = mongoose.model('covidInfo', covidInfoSchema);