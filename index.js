const express = require("express");
const { getDefaultSettings } = require("http2");
const app = express();
const port = 8000;

let todayDate = new Date();

app.get("/", (req, res) => {
  res.json(sampleData);
});

app.get("/flashLoan", (req, res) => {
  let isNewMember = getMemberStatus(sampleData.memberStartDate) == 0;
  let flashLoanTotal = flashLoan(isNewMember, sampleData.salary, sampleData.bondTotal);
  res.send('<p> ยอดกู้ฉุกเฉินก่อนหักรายจ่าย '+ flashLoanTotal +' บาท</p>');
});

function getMemberStatus(memberStartDate) {
  let startDate = new Date(memberStartDate);
  if (todayDate.getFullYear() - startDate.getFullYear() >= 1) {
    return todayDate.getFullYear() - startDate.getFullYear();
  } else {
    if (12 - startDate.getMonth() > 6) {
      return 0.5;
    } else {
      return 0;
    }
  }
}

function flashLoan(isNewMember, salary, bond) {
  let bondRatio = (bond * 90) / 100;
  if (isNewMember) {
    return 0;
  } else {
      if ((salary * 2) >= bondRatio) {
        return bondRatio;
      } else {
        return (salary * 2);
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

let sampleData = {
  name: "นาย ผ่อน  พรหมจาต",
  citizenId: "3120100344708",
  memberId: "106",
  birthDate: "10/12/2471",
  age: "80  ปี  1  เดือน",
  memberStartDate: "04/01/2514",
  memberPeriod: "94",
  salary: 15698,
  bondTotal: 513940,
  bondPerMonth: 1000,
  contract: [
    {
      id: "ส003190/2562",
      startDate: "18/02/2562",
      periodTotal: 239,
      approvalLimit: 429000,
      payPerMonth: 1800,
      paidPeriodTotal: 36
    },
    {
      id: "ก016770/2563",
      startDate: "15/09/2563",
      periodTotal: 82,
      approvalLimit: 49000,
      payPerMonth: 600,
      paidPeriodTotal: 17
    }
  ]
}