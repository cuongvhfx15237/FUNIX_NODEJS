exports.getDateTimeFromTimeStamp = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month <= 2) month = "0" + month;
  if (day <= 9) day = "0" + day;
  return `${day}-${month}-${year}`;
};
