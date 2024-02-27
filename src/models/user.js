const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annual = new Schema({
  annualDate: String,
  annualTime: {
    type: Number,
  },
  reason: {
    type: String,
  },
  _id: false,
});
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  name: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  permissionUser: [
    {
      type: String,
    },
  ],
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
    required: true,
  },
  progress: {
    workHistory: [
      {
        year: { type: Number },
        data: [
          {
            month: { type: Number },
            data: [
              {
                checkIn: {
                  type: Date,
                },
                checkOut: {
                  type: Date,
                },
                Space: {
                  type: String,
                },
                _id: false,
              },
            ],
            _id: false,
          },
        ],
        _id: false,
      },
    ],
    annual: [annual],
    status: {
      type: String,
      default: "true",
    },
    covid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "covidInfo",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
