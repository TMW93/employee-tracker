const inquirer = require(`inquirer`);

inquirer
  .prompt ([
    {
      type: `list`,
      message: `What would you like to do?`,
      choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View all Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`],
      name: `userChoice`,
    }
  ])
  .then((response) => {
    console.log(`This is your choice: ${response.userChoice}`);
  })
  .catch((err) => {
    console.log(err);
    console.log('Oops. Something went wrong.');
  });