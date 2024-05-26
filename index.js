const inquirer = require(`inquirer`);
const { Pool } = require('pg');
require(`dotenv`).config();

// Connect to database
const pool = new Pool(
  {
    // Enter PostgreSQL username
    user: process.env.db_user,
    // Enter PostgreSQL password
    password: process.env.db_pass,
    host: 'localhost',
    database: process.env.db_name
  },
console.log('Connected to the employees_db database!')
)

pool.connect();

const main = async () => {
  let choice = ``;
  while(choice !== `Quit`) {
    await inquirer
    .prompt ([
      {
        type: `list`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`],
        name: `userChoice`,
      }
    ])
    .then((response) => {
      choice = response.userChoice;
      switch(response.userChoice) {
        case `View All Employees`:
          pool.query('SELECT * FROM employee', function (err, {rows}) {
            // console.log(rows);
          });
          break;
        case `View All Roles`:
          pool.query('select role.id as "ID", role.title as "Title", department.name as "Department", role.salary as "Salary" from role join department on role.department_id  = department.id;', function (err, {rows}) {
            console.log(rows);
          });
          break;
        case `View All Departments`:
          pool.query('SELECT * FROM employee', function (err, {rows}) {
            // console.log(rows);
          });
          break;
        case `Quit`:
          break;
      }
    })
    .catch((err) => {
      console.log(err);
      console.log('Oops. Something went wrong.');
    });
  }
}

main();


