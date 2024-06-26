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
const getEmployees = async () => {
  const queryDB = `select id as "value", concat(employee.first_name, ' ', employee.last_name) as "name" from employee;`;
  const employees = await pool.query(queryDB);
  return employees.rows;
}

//this function gets all manager names from the db
const getManagers = async () => {
  let initManagers = {
    value: 0,
    name: `None`,
  };
  const queryDB = `select employee.id as "value", concat(employee.first_name, ' ', employee.last_name) as "name" from employee where employee.manager_id is null;`;
  const managers = await pool.query(queryDB);
  (managers.rows).push(initManagers);
  return managers.rows;
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
      // choices: [`None`, `John Doe`, `Ashley Rodriguez`, `Kunal Singh`, `Sarah Lourd`],
      choices: await getManagers(),
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
const addDept = async () => {
  const prompter = [
    {
      type: `input`,
      message: `What is the name the department?`,
      name: `name`,
    },
  ]

  return inquirer.prompt(prompter);
}

//this function updates employee role if prompt is chosen
const updateEmployee = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Which employee's role do you want to update?`,
      choices: await getEmployees(),
      name: `employee_id`,
    },
    {
      type: `list`,
      message: `Which role do you want to assign the selected employee?`,
      choices: await getRoles(),
      name: `role_id`,
    }
  ]

  return inquirer.prompt(prompter);
}

//this function gets a managers id if prompt is chosen
const byManager = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Choose which manager you'd like to view the employees of:`,
      choices: await getManagers(),
      name: `manager_id`,
    },
  ]

  return inquirer.prompt(prompter);
}

//this function gets a departments id if prompt is chosen (sort by department)
const byDept = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Choose which department you want to view:`,
      choices: await getDept(),
      name: `department_id`,
    }
  ]

  return inquirer.prompt(prompter);
}

//this function gets a departments id if prompt is chosen (delete department)
const deleteDept = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Choose which department you want to delete:`,
      choices: await getDept(),
      name: `department_id`,
    }
  ]

  return inquirer.prompt(prompter);
}

//this function gets an employees id if prompt is chosen (delete employee)
const deleteRow = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Choose which role you want to delete:`,
      choices: await getRoles(),
      name: `role_id`,
    }
  ]

  return inquirer.prompt(prompter);
}

//this function gets a roles id if prompt is chosen (delete role)
const deleteEmployee = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Choose which employee you want to delete:`,
      choices: await getEmployees(),
      name: `employee_id`,
    }
  ]

  return inquirer.prompt(prompter);
}

//this function gets all department ids if prompt is chosen (budget search, includes all departments)
const getDeptIDBudget = async () => {
  let initDept = {
    value: 0,
    name: `All Departments`,
  };
  const queryDB = `select id as "value", name from department;`;
  const departments = await pool.query(queryDB);
  (departments.rows).push(initDept);
  return departments.rows;
}

//this function gets a departments id if prompt is chosen (budget search)
const viewBudget = async () => {
  const prompter = [
    {
      type: `list`,
      message: `Choose which department you want to view:`,
      choices: await getDeptIDBudget(),
      name: `department_id`,
    }
  ]

  return inquirer.prompt(prompter);
}

//main prompter
const main = async () => {
  let choice = ``;
  while(choice !== `Quit`) {
    // const e = await getEmployees();
    // console.log(e);
    // const m = await getManagers();
    // console.log(m);
    // const r = await getRoles();
    // console.log(r);
    // const d = await getDept();
    // console.log(d);
    const inputs = await inquirer
    .prompt ([
      {
        type: `list`,
        message: `What would you like to do?`,
        choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Update Employee Role`, `View Employees By Manager`, `View Employees By Department`, `Remove an Employee`, `View Budget`, `Quit`],
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

        // console.log(userInputsEmployee.role_id);
        // console.log(userInputsEmployee.manager_id);

        //if there is not manager table accepts null not zero so we change it
        if(userInputsEmployee.manager_id === 0) {
          userInputsEmployee.manager_id = null;
        }
        // console.log(`insert into employee (first_name, last_name, role_id, manager_id) values ('${userInputsEmployee.first_name}', '${userInputsEmployee.last_name}', ${userInputsEmployee.role_id}, ${userInputsEmployee.manager_id});`);
        pool.query(`insert into employee (first_name, last_name, role_id, manager_id) values ('${userInputsEmployee.first_name}', '${userInputsEmployee.last_name}', ${userInputsEmployee.role_id}, ${userInputsEmployee.manager_id});`);
        break;
      //adding a role
      case `Add Role`:
        const userInputsRole = await addRole();

        console.log(userInputsRole.department_id);
        // const deptID =  await pool.query(`select id from department where name = '${userInputsRole.department_id}'`);
        // console.log(deptID);
        // console.log(`insert into role (title, salary, department_id) values ('${userInputsRole.title}', ${userInputsRole.salary}, ${userInputsRole.department_id});`);

        pool.query(`insert into role (title, salary, department_id) values ('${userInputsRole.title}', ${userInputsRole.salary}, ${userInputsRole.department_id});`);
        break;
      //adding a department
      case `Add Department`:
        const userInputsDept = await addDept();
        pool.query(`insert into department (name) values ('${userInputsDept.name}');`);
        break;  
      //updating an employees role
      case `Update Employee Role`:
        const userInputUpdate = await updateEmployee();

        // console.log(userInputUpdate.employee_id);
        // console.log(userInputUpdate.role_id);
        
        pool.query(`update employee set role_id = ${userInputUpdate.role_id} where id = ${userInputUpdate.employee_id};`);
        break;
      //view employees by manager
      case `View Employees By Manager`:
        const userInputManager = await byManager();
        // console.log(userInputManager.manager_id);

        if(userInputManager.manager_id === 0) {
          userInputManager.manager_id = null;
        }

        pool.query(`select concat(e2.first_name, ' ', e2.last_name) as "Manager", concat(e1.first_name, ' ', e1.last_name) as "Employee" from employee e1 left join employee e2 on e1.manager_id = e2.id where e2.id = ${userInputManager.manager_id};`, function(err, {rows}) {
          console.table(rows);
        });
        break;
      //view employess by department
      case `View Employees By Department`:
        const userinputDept = await byDept();
        // console.log(userinputDept.department_id);

        pool.query(`select department.name as "Department", role.title as "Role", concat(employee.first_name, ' ', employee.last_name) as "Employee" from employee join role on employee.role_id = role.id join department on role.department_id = department.id where department.id = ${userinputDept.department_id};`, function(err, {rows}) {
          console.table(rows);
        });
        break;
      //delete an employee
      case `Remove an Employee`:
        const userChoiceEmployee = await deleteEmployee();
        // console.log(userChoiceEmployee.employee_id);
        pool.query(`delete from employee where id = ${userChoiceEmployee.employee_id}`);
        break;
      //delete a role

      //delete a department

      //view budget
      case `View Budget`:
        const salary = await viewBudget();
        // console.log(salary.department_id);
        
        if(salary.department_id === 0) {
          pool.query(`select department.name as "Department", sum(role.salary) as "Salary" from role join department on role.department_id = department.id group by department.name;`, function(err, {rows}) {
            console.table(rows);
          });
        } else {
          pool.query(`select department.name as "Department", sum(role.salary) as "Salary" from role join department on role.department_id = department.id where department.id = ${salary.department_id} group by department.name;`, function(err, {rows}) {
            console.table(rows);
          });
        }

        break;
      //user selecting quit
      case `Quit`:
        process.exit(0);
    }
  }
}

main();

