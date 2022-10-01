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
                _id: false
            }
        ],
        annual: [
            {
                annualDate: {
                    type: String,
                },
                annualTime:{
                    type: String
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
        
    }
   
})


module.exports = mongoose.model('User', userSchema);