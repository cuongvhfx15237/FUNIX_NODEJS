exports.getHourTimeFromTimeStamp = (dateTime) => {
  if (dateTime) {
    let date = new Date(dateTime);
    let hour = date.getHours();
    let minute = date.getMinutes();

    if (hour <= 9) hour = "0" + hour;
    if (minute <= 9) minute = "0" + minute;

    return `${hour}:${minute}`;
  }
  return null;
};
