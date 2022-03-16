const express = require("express");
const { getDefaultSettings } = require("http2");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({
    firstname: "test",
    lastname: "test",
    dateofbirth: "1987-02-11",
    age: getAge(1987-02-11),
    dateofmember: "2009-01-03",
    salary: "30000.00",
  });
});

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
