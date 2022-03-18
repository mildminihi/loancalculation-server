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
    salary: 30000,
    bondTotal: 100000,
    bondPerMonth: 2000,
    bondInstallmentCount: 50
  });
});

function flashLoan(memberYear, salary, bond) {
  let bondRatio = (bond * 90) / 100;
  if (memberYear < 0.5) {
    return "อายุสมาชิกไม่ผ่านเกณฑ์อย่างน้อย 6 เดือน";
  } else {
      if ((salary * 2) >= bondRatio) {
        return "สิทธิ์กู้ฉุกเฉินได้ไม่เกิน " + bondRatio + " บาท";
      } else {
        return "สิทธิ์กู้ฉุกเฉินได้ไม่เกิน " + (salary * 2) + " บาท";
      }
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

function getMemberYear(bondInstallmentCount) {
  if (bondInstallmentCount < 6) {
    return 0;
  } else if (bondInstallmentCount < 12) {
    return 0.5;
  } else {
    return bondInstallmentCount % 12;
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
