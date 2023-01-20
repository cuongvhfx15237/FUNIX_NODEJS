const User = require("../models/user");
const { validationResult } = require("express-validator");
const fs = require("fs");
const ITEMS_PER_PAGE = 2;
const path = require("path");
const PDFDocument = require("pdfkit");

exports.getIndex = (req, res, next) => {
  let workHis = req.user.progress.workHistory;
  const length = workHis.length;
  const today = new Date();
  if (length === 0) {
    res.render("Working", {
      name: req.user.name,
      image: req.user.Image,
      workHis: workHis,
      status: req.user.progress.status,
      timeLapse: 0,
      annualLeave: "",
      today: today,
    });
  } else {
    res.render("Working", {
      name: req.user.name,
      image: req.user.Image,
      workHis: workHis,
      status: req.user.progress.status,
      annualLeave: req.user.annualLeave,
      today: today,
    });
  }
};
exports.postCheckin = (req, res, next) => {
  const workSpace = req.body.workSpace;
  const h = new Date();
  req.user.progress.workHistory.push({
    checkin: h,
    checkout: "",
    Space: workSpace,
  });

  req.user.progress.status = "false";
  req.user.save().then(() => {
    res.redirect("/");
  });
};

exports.postCheckout = (req, res, next) => {
  const h = new Date();
  const length = req.user.progress.workHistory.length;
  req.user.progress.workHistory[length - 1].checkout = h;
  req.user.progress.status = "true";
  req.user.save().then(() => {
    res.redirect("/");
  });
};

exports.postAnnual = (req, res, next) => {
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
exports.getInfo = (req, res, next) => {
  res.render("info", {
    user: req.user,
  });
};
exports.postNewImage = (req, res, next) => {
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
    console.log(errors.array());
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

exports.getSearch = (req, res, next) => {
    const page = req.query.page;
    let salaryPerMonth = req.user.salaryScale * 3000000;
    const workHistories = []
    for (let i = 0; i < 12; i++) {
    workHistories.push([]);
    for (let j =0; j < req.user.progress.workHistory.length; j++){
      const m = new Date(req.user.progress.workHistory[j].checkin)
      if (m.getMonth() === i) {
        workHistories[i].push(req.user.progress.workHistory[j]);
      }
    }
    }

  User.find({ department: req.user.department, role: "admin" }).then(
    (admin) => {
      let adminId = admin[0]._id;
      let adminName = admin[0].name;
      // console.log(workHistories)
      const momentDefault = new Date()
      let selectObj = momentDefault.getMonth() +1
      if (page){
        selectObj = page
      }
      res.render("Search", {
        adminId: adminId,
        adminName: adminName,
        user: req.user,
        workHistories: workHistories[selectObj-1],
      });
    }
  );
};

exports.getSearch2 = (req, res, next) => {
  const workHistories = new Array();
  //create Date list
  let tempDate = [];
  for (let i = 0; i < req.user.progress.workHistory.length; i++) {
    let date = req.user.progress.workHistory[i].checkin
      .toDateString()
      .replace(/^\S+\s/, "");
    tempDate.push(date);
  }
  for (let i = 0; i < req.user.progress.annual.length; i++) {
    let date = new Date(req.user.progress.annual[i].annualDate);
    tempDate.push(date.toDateString().replace(/^\S+\s/, ""));
  }
  let dateLog = [...new Set(tempDate)];
  //create Date List
  //create workHistory Log
  let tempWorkHis = [];
  let t = [];

  for (let i = 0; i < req.user.progress.workHistory.length - 1; i++) {
    if (
      req.user.progress.workHistory[i + 1].checkin
        .toDateString()
        .replace(/^\S+\s/, "") ===
      req.user.progress.workHistory[i].checkin
        .toDateString()
        .replace(/^\S+\s/, "")
    ) {
      t.push(req.user.progress.workHistory[i]);
    } else {
      t.push(req.user.progress.workHistory[i]);
      tempWorkHis.push(t);
      t = [];
    }
  }
  if (
    req.user.progress.workHistory[
      req.user.progress.workHistory.length - 1
    ].checkin
      .toDateString()
      .replace(/^\S+\s/, "") ===
    req.user.progress.workHistory[
      req.user.progress.workHistory.length - 2
    ].checkin
      .toDateString()
      .replace(/^\S+\s/, "")
  ) {
    t.push(
      req.user.progress.workHistory[req.user.progress.workHistory.length - 1]
    );
  } else {
    t = [
      req.user.progress.workHistory[req.user.progress.workHistory.length - 1],
    ];
  }
  tempWorkHis.push(t);
  //create workHistory Log
  for (let i = 0; i < dateLog.length; i++) {
    let dateValue = dateLog[i];
    let workHis = new Array();
    let annual = 0;
    tempWorkHis.forEach((tmp) => {
      if (tmp[0].checkin.toDateString().replace(/^\S+\s/, "") === dateValue) {
        workHis = tmp;
      }
    });
    req.user.progress.annual.forEach((tp) => {
      let date = new Date(tp.annualDate);
      if (date.toDateString().replace(/^\S+\s/, "") === dateValue) {
        annual = tp.annualTime;
      }
    });
    let j = { date: dateValue, workHis: workHis, annual: annual };
    workHistories.push(j);
  }

  console.log(workHistories);

  let salaryPerMonth = req.user.salaryScale * 3000000;
  User.find({ department: req.user.department, role: "admin" }).then(
    (admin) => {
      let adminId = admin[0]._id;
      let adminName = admin[0].name;
      res.render("SearchV2", {
        adminId: adminId,
        adminName: adminName,
        user: req.user,
        workHistories: req.user.progress.workHistory,
        annual: req.user.progress.annual,
      });
    }
  );
};
