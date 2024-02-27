const User = require("../models/user");
const { validationResult } = require("express-validator");
const { use } = require("../Routers/Staff");
require("dotenv").config();
const host = process.env.BASE_URL_DOMAIN;
const {
  getDateTimeFromTimeStamp,
} = require("../common/getDateTimeFromTimeStamp");
const {
  getHourTimeFromTimeStamp,
} = require("../common/getHourTimeFromTimeStamp");

const getIndex = async (req, res) => {
  const workHis = req.user.progress.workHistory;
  const lastWorkingYear = workHis[workHis.length - 1].data;
  const lastWorkingMonth = lastWorkingYear[lastWorkingYear.length - 1].data;
  const today = new Date();
  const listWorkingOfCurrentDate = [];

  lastWorkingMonth.forEach((workingDay) => {
    if (workingDay.checkIn.getDate() === today.getDate()) {
      listWorkingOfCurrentDate.push(workingDay);
    }
    return;
  });

  if (workHis.length === 0) {
    await res.render("Working", {
      name: req.user.name,
      image: req.user.Image,
      workHis: listWorkingOfCurrentDate,
      status: req.user.progress.status,
      timeLapse: 0,
      annualLeave: "",
      today: today,
    });
  } else {
    await res.render("Working", {
      name: req.user.name,
      image: req.user.Image,
      workHis: listWorkingOfCurrentDate,
      status: req.user.progress.status,
      annualLeave: req.user.annualLeave,
      today: today,
    });
  }
};
const postCheckIn = (req, res) => {
  const workSpace = req.body.workSpace;
  const currentTime = new Date();
  const listWorking = req.user.progress.workHistory;
  const listWorkingLastYear = listWorking[listWorking.length - 1].data;

  if (currentTime.getFullYear() === listWorking[listWorking.length - 1].year) {
    if (
      currentTime.getMonth() ===
      listWorkingLastYear[listWorkingLastYear.length - 1].month
    ) {
      req.user.progress.workHistory[listWorking.length - 1].data[
        listWorkingLastYear.length - 1
      ].data.push({
        checkIn: currentTime,
        checkOut: "",
        Space: workSpace,
      });
    } else {
      req.user.progress.workHistory[listWorking.length - 1].data.push({
        month: currentTime.getMonth(),
        data: { checkIn: currentTime, checkOut: "", Space: workSpace },
      });
    }
  } else {
    req.user.progress.workHistory.push({
      year: currentTime.getFullYear(),
      data: [
        {
          month: 0,
          data: [
            {
              checkIn: currentTime,
              checkOut: "",
              Space: workSpace,
            },
          ],
        },
      ],
    });
  }

  req.user.progress.status = "false";

  req.user.save().then(() => {
    res.redirect("/");
  });
};

const postCheckOut = (req, res) => {
  const currentTime = new Date();
  const listYear = req.user.progress.workHistory;
  const listMonthOfCurrentYear =
    req.user.progress.workHistory[listYear.length - 1].data;
  const listDateOfCurrentMonth =
    req.user.progress.workHistory[listYear.length - 1].data[
      listMonthOfCurrentYear.length - 1
    ].data;

  req.user.progress.workHistory[listYear.length - 1].data[
    listMonthOfCurrentYear.length - 1
  ].data[listDateOfCurrentMonth.length - 1].checkOut = currentTime;

  req.user.progress.status = "true";

  req.user.save().then(() => {
    res.redirect("/");
  });
};

const postAnnual = (req, res) => {
  const annualChecks = req.body.dateAnnual.split(",");
  const annualRemain =
    req.user.annualLeave * 8 - annualChecks.length * req.body.timeAnnual;
  annualChecks.forEach((annualCheck) => {
    annualCheck = new Date(annualCheck);
    req.user.progress.annual.push({
      annualDate: annualCheck,
      annualTime: parseInt(req.body.timeAnnual),
      reason: req.body.reasonAnnual,
    });
  });
  req.user.annualLeave = annualRemain / 8;
  req.user.save().then(() => {
    res.redirect("/");
  });
};

//test requet code
const getInfo = (req, res) => {};
const postNewImage = (req, res, next) => {
  const image = req.file;
  if (!image) {
    return res.status(422).render("info", {
      pageTitle: "Info",
      path: "/info",
      user: req.user,
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("info", {
      pageTitle: "info",
      path: "/info",
      editing: false,
      hasError: true,
      user: req.user,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const imageUrl = image.filename;
  req.user.Image = imageUrl;
  req.user
    .save()
    .then(() => {
      res.redirect("/info");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getSearch = (req, res) => {
  const listOfYear = req.user.progress.workHistory;
  const listOfMonth = req.user.progress.workHistory[listOfYear.length - 1].data;
  const selectedMonth = listOfMonth[listOfMonth.length - 1].data;
  const generateSelected =
    generateListWorkingDaysOfSelectedMonth(selectedMonth);

  User.findOne({ department: req.user.department, role: "admin" }).then(
    (admin) => {
      let adminId = admin._id;
      let adminName = admin.name;
      const momentDefault = new Date();
      let selectObj = momentDefault.getMonth() + 1;

      res.render("Search", {
        adminId: adminId,
        adminName: adminName,
        user: req.user,
        workHistories: generateSelected,
        host: host,
        selectedMonth: req.query.page
      });
    }
  );
};

const generateListWorkingDaysOfSelectedMonth = (listHistoryOfWorkingDays) => {
  const listWorkingDays = [];
  for (let i = 0; i < listHistoryOfWorkingDays.length; i++) {
    if (
      i === 0 ||
      new Date(listHistoryOfWorkingDays[i].checkIn).getDate() !==
        new Date(listHistoryOfWorkingDays[i - 1].checkIn).getDate()
    ) {
      listWorkingDays.push({
        date: getDateTimeFromTimeStamp(listHistoryOfWorkingDays[i].checkIn),
        data: [
          {
            checkIn: getHourTimeFromTimeStamp(
              listHistoryOfWorkingDays[i].checkIn
            ),
            checkOut: getHourTimeFromTimeStamp(
              listHistoryOfWorkingDays[i].checkOut
            ),
            totalTime:
              (listHistoryOfWorkingDays[i].checkOut -
                listHistoryOfWorkingDays[i].checkIn) /
              3600000,
            space: listHistoryOfWorkingDays[i].Space,
          },
        ],
        workTime: 0,
      });
    } else {
      listWorkingDays[listWorkingDays.length - 1].data.push({
        checkIn: getHourTimeFromTimeStamp(listHistoryOfWorkingDays[i].checkIn),
        checkOut: getHourTimeFromTimeStamp(
          listHistoryOfWorkingDays[i].checkOut
        ),
        totalTime:
          (listHistoryOfWorkingDays[i].checkOut -
            listHistoryOfWorkingDays[i].checkIn) /
          3600000,
        space: listHistoryOfWorkingDays[i].Space,
      });
    }
  }

  listWorkingDays.map((workingDay) => {
    let workTime = 0;
    workingDay.data.forEach((item) => (workTime += item.totalTime));
    return (workingDay.workTime = workTime);
  });

  return listWorkingDays;
};

// exports.getSearch2 = (req, res, next) => {
//   const workHistories = new Array();
//   //create Date list
//   let tempDate = [];
//   for (let i = 0; i < req.user.progress.workHistory.length; i++) {
//     let date = req.user.progress.workHistory[i].checkIn
//       .toDateString()
//       .replace(/^\S+\s/, "");
//     tempDate.push(date);
//   }
//   for (let i = 0; i < req.user.progress.annual.length; i++) {
//     let date = new Date(req.user.progress.annual[i].annualDate);
//     tempDate.push(date.toDateString().replace(/^\S+\s/, ""));
//   }
//   let dateLog = [...new Set(tempDate)];
//   //create Date List
//   //create workHistory Log
//   let tempWorkHis = [];
//   let t = [];

//   for (let i = 0; i < req.user.progress.workHistory.length - 1; i++) {
//     if (
//       req.user.progress.workHistory[i + 1].checkIn
//         .toDateString()
//         .replace(/^\S+\s/, "") ===
//       req.user.progress.workHistory[i].checkIn
//         .toDateString()
//         .replace(/^\S+\s/, "")
//     ) {
//       t.push(req.user.progress.workHistory[i]);
//     } else {
//       t.push(req.user.progress.workHistory[i]);
//       tempWorkHis.push(t);
//       t = [];
//     }
//   }
//   if (
//     req.user.progress.workHistory[
//       req.user.progress.workHistory.length - 1
//     ].checkIn
//       .toDateString()
//       .replace(/^\S+\s/, "") ===
//     req.user.progress.workHistory[
//       req.user.progress.workHistory.length - 2
//     ].checkIn
//       .toDateString()
//       .replace(/^\S+\s/, "")
//   ) {
//     t.push(
//       req.user.progress.workHistory[req.user.progress.workHistory.length - 1]
//     );
//   } else {
//     t = [
//       req.user.progress.workHistory[req.user.progress.workHistory.length - 1],
//     ];
//   }
//   tempWorkHis.push(t);
//   //create workHistory Log
//   for (let i = 0; i < dateLog.length; i++) {
//     let dateValue = dateLog[i];
//     let workHis = new Array();
//     let annual = 0;
//     tempWorkHis.forEach((tmp) => {
//       if (tmp[0].checkIn.toDateString().replace(/^\S+\s/, "") === dateValue) {
//         workHis = tmp;
//       }
//     });
//     req.user.progress.annual.forEach((tp) => {
//       let date = new Date(tp.annualDate);
//       if (date.toDateString().replace(/^\S+\s/, "") === dateValue) {
//         annual = tp.annualTime;
//       }
//     });
//     let j = { date: dateValue, workHis: workHis, annual: annual };
//     workHistories.push(j);
//   }

//   let salaryPerMonth = req.user.salaryScale * 3000000;
//   User.find({ department: req.user.department, role: "admin" }).then(
//     (admin) => {
//       let adminId = admin[0]._id;
//       let adminName = admin[0].name;
//       res.render("SearchV2", {
//         adminId: adminId,
//         adminName: adminName,
//         user: req.user,
//         workHistories: req.user.progress.workHistory,
//         annual: req.user.progress.annual,
//       });
//     }
//   );
// };

// exports.getSearch2 = (req, res) => {
//   const generateWorkHistory = () => {
//     let listOfYear = [];
//     for (year = 2020; year < 2025; year++) {
//       let generateItem = { year, data: [] };
//       let monthLength = 12;
//       const endOfYear = new Date(year, 11, 31);
//       const current = new Date();
//       if (current < endOfYear) {
//         monthLength = current.getMonth();
//       }
//       // Loop through all the months (0-11 represent January to December)
//       let listOfMonth = [];
//       for (let month = 0; month < monthLength; month++) {
//         let listOfDate = [];

//         // Create a new Date object for the first day of the month
//         let currentDate = new Date(year, month, 1);

//         // Loop through all the days in the month
//         while (currentDate.getMonth() === month) {
//           let setStartHour = 8;
//           let setEndHour = 17;
//           let space = "Office";
//           let randomNumber = Math.random();
//           if (randomNumber < 0.3) {
//             space = "Home";
//           }
//           if (randomNumber > 0.9) {
//             setStartHour = 9;
//           }
//           if (randomNumber < 0.1) {
//             setEndHour = 16;
//           }
//           if (
//             (randomNumber > 0.1 && randomNumber < 0.2) ||
//             (randomNumber > 0.8 && randomNumber < 0.9)
//           ) {
//             setEndHour = 19;
//           }
//           // Check if the day is Saturday (day 6) or Sunday (day 0)
//           if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
//             // If it's Saturday or Sunday, add it to the result array
//             listOfDate.push(
//               {
//                 checkIn: currentDate.setHours(setStartHour),
//                 checkOut: currentDate.setHours(12),
//                 Space: space,
//               },
//               {
//                 checkIn: currentDate.setHours(13),
//                 checkOut: currentDate.setHours(setEndHour),
//                 Space: space,
//               }
//             );
//           }
//           // Move to the next day
//           currentDate.setDate(currentDate.getDate() + 1);
//         }
//         generateItem.data.push({ month, data: listOfDate });
//       }
//       listOfYear.push(generateItem);
//     }

//     const x = [];
//     for (i = 0; i < 26; i++) {
//       let currentDate = new Date(2024, 1, i + 1);
//       if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
//         // If it's Saturday or Sunday, add it to the result array
//         x.push(
//           {
//             checkIn: currentDate.setHours(8),
//             checkOut: currentDate.setHours(12),
//             Space: "Office",
//           },
//           {
//             checkIn: currentDate.setHours(13),
//             checkOut: currentDate.setHours(17),
//             Space: "Office",
//           }
//         );
//       }
//     }
//     listOfYear[listOfYear.length - 1].data.push({ month: 1, data: x });

//     return listOfYear;
//   };

//   const generateWorkHistories = generateWorkHistory();

//   User.find().then((result) => {
//     result.forEach((user) => {
//       user.progress.workHistory = generateWorkHistories;
//       user.save();
//     });
//   });
// };

module.exports = {
  getIndex,
  postCheckIn,
  postCheckOut,
  postAnnual,
  getInfo,
  postNewImage,
  getSearch,
};
