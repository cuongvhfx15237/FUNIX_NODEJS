const mongoose = require('mongoose');
const userSchema = new mongoose.Schema ({
    name: {
        type: String,
    },
    doB: {
        type: String,
    },
    salaryScale: {
        type: Number,
    },
    startDate: {
        type: String,
    },
    department: {
        type: String,
    },
    annualLeave: {
        type: Number,
    },
    Image: {
        type: String,
        required: true
    },
    progress: {
        workHistory: [
            { 
                checkin: {
                    type: Date,
                },
                checkout: {
                    type: Date,
                },
                Space: {
                    type: String,
                },
            }
        ],
        annual: [
            {
                annualDate: {
                    type: String,
                },
                annualTime:{
                    type: Number,
                },
                reason: {
                    type: String,
                },
                _id: false
            }
        ],
        status: {
            type: String,
            default: 'true'
        },
        covid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'covidInfo'
        }
    }
   
})


module.exports = mongoose.model('User', userSchema);