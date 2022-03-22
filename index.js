const express = require("express");
const { getDefaultSettings } = require("http2");
const app = express();
const cors = require('cors');
app.use(cors());
const port = 8000;

let todayDate = new Date();

app.get("/user/106", (req, res) => {
  res.json(sampleData);
});

app.get("/flashLoan", (req, res) => {
  res.json(flashLoan(sampleData));
});

app.get("/medium", (req, res) => {

});

function flashLoan(userData) {
  let salary = userData.salary;
  let isNewMember = getMemberStatus(userData.memberStartDate) == 0;
  let bond = userData.bondTotal;
  let bondRatio = (bond * 90) / 100;
  let payPerMonthTotal = getOtherLoanPayPerMonth(userData.contracts, "ฉ");
  var incomePerMonth = salary - payPerMonthTotal;
  var flashLoanTotal = 0;
  // ถ้าเป็นสมาชิกไม่ถึง 6 เดือนไม่มีสิทธิ์กู้ กู้ได้สูงสุดเท่ากับ2เท่าของเงินเดือนและไม่เกิน90%ของหุ้น
  if (isNewMember) {
    flashLoanTotal = 0;
  } else {
    if (incomePerMonth <= 2000) {
      flashLoanTotal = 0;
    } else {
      if ((incomePerMonth * 2) >= bondRatio) {
        flashLoanTotal = bondRatio;
      } else {
        flashLoanTotal = (Math.floor((incomePerMonth * 2) / 100) * 100);
      }
    }
  }
  let previousFlashLoan = getOutStandingByType("ฉ", userData.contracts);
  flashLoanTotal -= previousFlashLoan;
  var flashLoanPerMonth = Math.ceil((flashLoanTotal / 12) / 10) * 10;
  var salaryAfterNewLoan = incomePerMonth - flashLoanPerMonth;
  var flashLoanLastMonth = flashLoanTotal - (flashLoanPerMonth * 11);

  return {
    flashLoanTotal: flashLoanTotal, //วงเงินกู้ทั้งหมด
    salaryBeforeNewLoan: incomePerMonth, //เงินได้รายเดือนก่อนกู้
    previousFlashLoan: previousFlashLoan, //ยอดเงินกู้ฉุกเฉินสัญญาเก่า
    newFlashLoanPerMonth: flashLoanPerMonth, //ยอดเงินกู้ต่อเดือน 1-11
    flashLoanLastMonth: flashLoanLastMonth, //ยอดเงินกู้เดือนสุดท้าย
    salaryAfterNewLoan: salaryAfterNewLoan //เงินได้รายเดือนหลังกู้ฉุกเฉินใหม่
  }
}

function getOutStandingByType(type, contracts) {
  const result = contracts.filter(contract => contract.id.slice(0, 1) == type);
  if (result.length == 0) {
    return 0
  } else {
    return result[0].outStanding;
  }
}

function getOtherLoanPayPerMonth(contracts, loanType) {
  var totalPayPerMonth = 0;
  contracts.forEach(contract => {
    if (contract.id.slice(0, 1) != loanType) {
      let principle = contract.payPerMonth;
      let interest = getInterest(contract.id.slice(0, 1), contract.outStanding);
      let payPerMonth = principle + interest;
      totalPayPerMonth += payPerMonth;
    }
  });
  return totalPayPerMonth;
}

function getInterest(type, outStanding) {
  var interest = 0;
  switch (type) {
    case "ก", "ส", "ฉ":
      interest = 6.15;
      break;
    case "c":
      interest = 4.9;
      break;
    case "s":
      interest = 3.9;
      break;
    default:
      interest = 5.9;
      break;
  }
  return ((outStanding * interest * 30) / 36500);
}

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

function mediumLoan(memberPeriod) {
  if (memberPeriod == 0.5) {
    return 100000;
  } else if (memberPeriod == 1) {
    return 400000;
  } else {
    return 600000;
  }
}

function getRetireSalary(retireYearTotal, salary) {
  var totalSalary = salary;
  for (let i = 0; i < retireYearTotal; i++) {
    totalSalary += (salary * 5) / 100;
  }
  return totalSalary;
}

function getRetireYearTotal(dob) {
  let age = getAge(dob);
  let birthDate = new Date(dob);
  var retireYearTotal = 60 - age;
  if (birthDate.getMonth < 10) {
    return retireYearTotal;
  } else {
    return retireYearTotal + 1;
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
  age: "93 ปี 3 เดือน",
  memberStartDate: "04/01/2514",
  salary: 15698,
  bondTotal: 513940,
  bondPerMonth: 1000,
  contracts: [
    {
      id: "ส003190/2562",
      startDate: "18/02/2562",
      periodTotal: 239,
      approvalLimit: 429000,
      payPerMonth: 1800,
      paidPeriodTotal: 36,
      outStanding: 364200
    },
    {
      id: "ก016770/2563",
      startDate: "15/09/2563",
      periodTotal: 82,
      approvalLimit: 49000,
      payPerMonth: 600,
      paidPeriodTotal: 17,
      outStanding: 38800
    }
  ]
}

// (364200 * 6.15 * 30) / 36500
// ยอดคงเหลือ  ดอกเบี้ย