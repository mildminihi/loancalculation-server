const express = require("express");
const { getDefaultSettings } = require("http2");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 8000;

let todayDate = new Date();

app.get("/user/106", (req, res) => {
  res.json(sampleData);
});

app.get("/flashLoan", (req, res) => {
  res.json(flashLoan(sampleData));
});

app.get("/mediumLoan", (req, res) => {
  res.json(mediumLoan(sampleData));
});

function flashLoan(userData) {
  let salary = userData.salary;
  let isNewMember = getMemberStatus(userData.memberStartDate) == 0;
  let bond = userData.bondTotal;
  let bondRatio = (bond * 90) / 100;
  let payPerMonthTotal = getOtherLoanPayPerMonth(userData.contracts, "ฉ");
  var incomePerMonth = salary - payPerMonthTotal;
  var totalFlashLoan = 0;
  // ถ้าเป็นสมาชิกไม่ถึง 6 เดือนไม่มีสิทธิ์กู้ กู้ได้สูงสุดเท่ากับ2เท่าของเงินเดือนและไม่เกิน90%ของหุ้น
  if (isNewMember) {
    totalFlashLoan = 0;
  } else {
    if (incomePerMonth <= 2000) {
      totalFlashLoan = 0;
    } else {
      if (incomePerMonth * 2 >= bondRatio) {
        totalFlashLoan = bondRatio;
      } else {
        totalFlashLoan = Math.floor((incomePerMonth * 2) / 100) * 100;
      }
    }
  }
  let previousFlashLoan = getOutStandingByType("ฉ", userData.contracts);
  totalFlashLoan -= previousFlashLoan;
  var flashLoanPerMonth = Math.ceil(totalFlashLoan / 12 / 10) * 10;
  var salaryAfterNewLoan = incomePerMonth - flashLoanPerMonth;
  var flashLoanLastMonth = totalFlashLoan - flashLoanPerMonth * 11;

  return {
    totalFlashLoan: totalFlashLoan, //วงเงินกู้ทั้งหมด
    salaryBeforeNewLoan: incomePerMonth, //เงินได้รายเดือนก่อนกู้
    previousFlashLoan: previousFlashLoan, //ยอดเงินกู้ฉุกเฉินสัญญาเก่า
    newFlashLoanPerMonth: flashLoanPerMonth, //ยอดเงินกู้ต่อเดือน 1-11
    flashLoanLastMonth: flashLoanLastMonth, //ยอดเงินกู้เดือนสุดท้าย
    salaryAfterNewLoan: salaryAfterNewLoan, //เงินได้รายเดือนหลังกู้ฉุกเฉินใหม่
  };
}

function getOutStandingByType(type, contracts) {
  const result = contracts.filter(
    (contract) => contract.id.slice(0, 1) == type
  );
  if (result.length == 0) {
    return 0;
  } else {
    return result[0].outStanding;
  }
}

function getOtherLoanPayPerMonth(contracts, loanType) {
  var totalPayPerMonth = 0;
  contracts.forEach((contract) => {
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
    case ("ก", "ส", "ฉ"):
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
  return (outStanding * interest * 30) / 36500;
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

function mediumLoan(userData) {
  var totalMediumLoan;
  let payPerMonthTotal = getOtherLoanPayPerMonth(userData.contracts, "ก");
  var incomePerMonth = userData.salary - payPerMonthTotal;
  var memberPeriod = getMemberStatus(userData.memberStartDate);
  let age = parseInt(userData.age.slice(0,2));
  // เชคเงื่อนไข อายุกการเป็นสมาชิก อายุสมาชิก เงินได้ต่อเดือน
  if (memberPeriod == 0 || age >= 70 || incomePerMonth <= 2000) {
    return {
      totalMediumLoan: 0,
    };
  }
  if (memberPeriod == 0.5) {
    totalMediumLoan = 100000;
  } else if (memberPeriod == 1) {
    totalMediumLoan = 400000;
  } else {
    totalMediumLoan = 600000;
  }
  var previousMediumLoan = getOutStandingByType("ก", userData.contracts);
  totalMediumLoan -= previousMediumLoan;
  var loanAbleYear = 70 - age;
  var loanPeriod = 96;
  var mediumLoanPerMonth;
  // คำนวนงวด
  if (loanAbleYear >= 8) {
    mediumLoanPerMonth = Math.ceil(totalMediumLoan / loanPeriod / 10) * 10;
  } else {
    // คำนวนงวดถ้าอายุมากว่า 62 ปี
  }
  let mediumLoanLastMonth =
    totalMediumLoan - mediumLoanPerMonth * (loanPeriod - 1);
  let salaryAfterNewLoan = incomePerMonth - mediumLoanPerMonth;
  return {
    totalMediumLoan: totalMediumLoan, //วงเงินกู้ทั้งหมด
    salaryBeforeNewLoan: incomePerMonth, //เงินได้รายเดือนก่อนกู้
    previousMediumLoan: previousMediumLoan, //ยอดเงินกู้ปานกลางสัญญาเก่า
    newMediumLoanPerMonth: mediumLoanPerMonth, //ยอดเงินกู้ต่องวด 1-ก่อนงวดสุดท้าย
    mediumLoanLastMonth: mediumLoanLastMonth, //ยอดเงินกู้งวดสุดท้าย
    salaryAfterNewLoan: salaryAfterNewLoan, //เงินได้รายเดือนหลังกู้ปานกลางใหม่
  };
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
      outStanding: 364200,
    },
    {
      id: "ก016770/2563",
      startDate: "15/09/2563",
      periodTotal: 82,
      approvalLimit: 49000,
      payPerMonth: 600,
      paidPeriodTotal: 17,
      outStanding: 38800,
    },
  ],
};

// (364200 * 6.15 * 30) / 36500
// ยอดคงเหลือ  ดอกเบี้ย
