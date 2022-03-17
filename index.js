const express = require("express");
const { getDefaultSettings } = require("http2");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.json({
    firstname: "test",
    lastname: "test",
    dateofbirth: "1987-02-11",
    age: getAge(1987-02-11),
    dateofmember: "2009-01-03",
    salary: 30000.00,
    bond: 100000.00
  });
});

function flashLoan(isNewMember, salary, bond) {
  let bondRatio = (bond * 90) / 100;
  if (isNewMember) {
    return "อายุสมาชิกไม่ผ่านเกณฑ์อย่างน้อย 6 เดือน";
  } else {
      if ((salary * 2) >= bondRatio) {
        return "สิทธิ์กู้ฉุกเฉินได้ไม่เกิน " + bondRatio + " บาท";
      } else {
        return "สิทธิ์กู้ฉุกเฉินได้ไม่เกิน " + (salary * 2) + " บาท";
      }
  }
}

function getAge(dob) {
  let date_ob = new Date();
  let year = date_ob.getFullYear();
  let userDob = new Date(dob);
  let userYear = userDob.getFullYear();
  let age = year - userYear;
  return age.toString();
}

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
