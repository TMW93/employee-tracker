const inquirer = require(`inquirer`);
const { Pool } = require('pg');
require(`dotenv`).config();

// Connect to database
const pool = new Pool(
  {
    user: process.env.db_user,
    password: process.env.db_pass,
    host: 'localhost',
    database: process.env.db_name
  },
console.log('Connected to the employees_db database!')
)

pool.connect();

//this function gets all employee names from the db
const getManagers = async () => {
  const queryDB = `select id, concat(employee.first_name, ' ', employee.last_name) as "name" from employee;`;
  const employee = await pool.query(queryDB);
  return employee.rows;
}

//this function gets all role names from the db 
const getRoles = async () => {
  const queryDB = `select id as "value", title as "name" from role;`;
  const roles = await pool.query(queryDB);
  return roles.rows;
}

//this function gets all department names from the db
const getDept = async () => {
  const queryDB = `select id as "value", name from department;`;
  const departments = await pool.query(queryDB);
  return departments.rows;
}

//this function adds employess if prompt is chosen
const addEmployee = async () => {
  const prompter  = [
    {
      type: `input`,
      message: `What is the employee's first name?`,
      name: `first_name`,
    },
    {
      type: `input`,
      message: `What is the employee's last name?`,
      name: `last_name`,
    },
    {
      type: `list`,
      message: `What is the employee's role?`,
      // choices: [`Sales Lead`, `Salesperson`, `Lead Engineer`, `Software Engineering`, `Account Manager`, `Accountant`, `Legal Team Lead`, `Lawyer`],
      choices: await getRoles(),
      name: `role_id`,
    },
    {
      type: `list`,
      message: `Who is the employee's manager?`,
      choices: [`None`, `John Doe`, `Ashley Rodriguez`, `Kunal Singh`, `Sarah Lourd`],
      name: `manager_id`,
    },
  ]

  return inquirer.prompt(prompter);
}

//this function adds roles if prompt is chosen
const addRole = async () => {
  const prompter = [
    {
      type: `input`,
      message: `What is the name of the role?`,
      name: `title`,
    },
    {
      type: `number`,
      message: `What is the salary of the role?`,
      name: `salary`,
    },
    {
      type: `list`,
      message: `What department does the role belong to?`,
      // choices: [`Sales`, `Engineering`, `Finance`, `Legal`],
      choices: await getDept(),
      name: `department_id`,
    },
  ]

  return inquirer.prompt(prompter);
}

//this function adds departments if prompt is chosen
const addDept = () => {
  const prompter = [
    {
      type: `input`,
      message: `What is the name the department?`,
      name: `name`,
    },
  ]

  return inquirer.prompt(prompter);
}

const main = async () => {
  let choice = ``;
  while(choice !== `Quit`) {
    // const e = await getEmployees();
    // console.log(e);
    // const r = await getRoles();
    // console.log(r);
    // const d = await getDept();
    // console.log(d);
    const inputs = await inquirer
    .prompt ([
      {
        type: `list`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`],
        name: `userChoice`,
      }
    ]);

    switch(inputs.userChoice) {
      //viewing all employees
      case `View All Employees`:
        pool.query(`select e1.id as "ID", e1.first_name as "First_Name", e1.last_name as "Surname", role.title as "Job_Description", department.name as "Department", role.salary as "Salary", concat(e2.first_name, ' ', e2.last_name) as "Manager" from employee e1 join role on e1.role_id = role.id join department on role.department_id = department.id left join employee e2 on e1.manager_id = e2.id;`, function (err, {rows}) {
          console.table(rows);
        });
        break;
      //viewing all roles
      case `View All Roles`:
        pool.query('select role.id as "ID", role.title as "Title", department.name as "Department", role.salary as "Salary" from role join department on role.department_id  = department.id;', function (err, {rows}) {
          console.table(rows);
        });
        break;
      //viewing all departments
      case `View All Departments`:
        pool.query('select department.id as "ID", department.name as "Department" from department;', function (err, {rows}) {
          // console.log(rows);
          console.table(rows);
        });
        break;
      //adding an employee
      case `Add Employee`:
        const userInputsEmployee = await addEmployee();

        //setting the role id to its corresponding id
        switch(userInputsEmployee.role_id) {
          case `Sales Lead`:
            userInputsEmployee.role_id = 1;
            break;
          case `Salesperson`:
            userInputsEmployee.role_id = 2;
            break;
          case `Lead Engineer`:
            userInputsEmployee.role_id = 3;
            break;
          case `Software Engineering`:
            userInputsEmployee.role_id = 4;
            break;
          case `Account Manager`:
            userInputsEmployee.role_id = 5;
            break;
          case `Accountant`:
            userInputsEmployee.role_id = 6;
            break;
          case `Legal Team Lead`:
            userInputsEmployee.role_id = 7;
            break;
          case `Lawyer`:
            userInputsEmployee.role_id = 8;
            break;
        }

        //setting the manager id to its corresponding id
        switch(userInputsEmployee.manager_id) {
          case `None`:
            userInputsEmployee.manager_id = null;
            break;
          case `John Doe`:
            userInputsEmployee.manager_id = 1;
            break;
          case `Ashley Rodriguez`:
            userInputsEmployee.manager_id = 2;
            break;
          case `Kunal Singh`:
            userInputsEmployee.manager_id = 3;
            break;
          case `Sarah Lourd`:
            userInputsEmployee.manager_id = 6;
            break;
        }

        // console.log(userInputsEmployee);

        pool.query(`insert into employee (first_name, last_name, role_id, manager_id) values (${userInputsEmployee.first_name}, ${userInputsEmployee.last_name}, ${userInputsEmployee.role_id}, ${userInputsEmployee.manager_id});`);
        break;
      //adding a role
      case `Add Role`:
        const userInputsRole = await addRole();

        //setting the department id to its corresponding id
         switch(userInputsRole) {
          case `Sales`:
            userInputsRole.department_id = 1;
            break;
          case `Engineering`:
            userInputsRole.department_id = 2;
            break;
          case `Finance`:
            userInputsRole.department_id = 3;
            break;
          case `Legal`:
            userInputsRole.department_id = 4;
            break;
        }
        // console.log(`insert into role (title, salary, department_id) values ('${userInputsRole.title}', ${userInputsRole.salary}, ${userInputsRole.department_id});`);
        pool.query(`insert into role (title, salary, department_id) values ('${userInputsRole.title}', ${userInputsRole.salary}, ${userInputsRole.department_id});`);

        break;
      //adding a department
      case `Add Department`:
        const userInputsDept = await addDept();
        pool.query(`insert into department (name) values ('${userInputsDept.name}');`);
        break;  
      //user selecting quit
      case `Quit`:
        process.exit(0);
    }
  }
}

main();

