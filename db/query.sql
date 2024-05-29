-- see all departments
select
  department.id as "ID",
  department.name as "Department"
from department;

-- see all roles, their salaries and which department it belongs to
select 
  role.id as "ID", 
  role.title as "Title", 
  department.name as "Department",
  role.salary as "Salary"
from role
join department on role.department_id  = department.id;

-- see all employees, their roles, which department they belong to, their salaries and who their manager is
select
  e1.id as "ID",
  e1.first_name as "First Name",
  e1.last_name as "Surname",
  role.title as "Job Description",
  department.name as "Department",
  role.salary as "Salary",
  concat(e2.first_name, ' ', e2.last_name) as "Manager"
from employee e1
join role on e1.role_id = role.id
join department on role.department_id = department.id
left join employee e2 on e1.manager_id = e2.id;

-- select a manager and e2.id and see which employees work under said manager
select 
  concat(e2.first_name, ' ', e2.last_name) as "Manager",
  concat(e1.first_name, ' ', e1.last_name) as "Employee"
  from employee e1
  left join employee e2 on e1.manager_id = e2.id
  where e2.id = 1;

-- select all managers
select
  e1.manager_id as "value",
  concat(e2.first_name, ' ', e2.last_name) as "name"
  from employee e1
  inner join employee e2 on e1.manager_id = e2.id;

-- select departments and the roles within the department
select
  department.name as "Department",
  role.title as "Role"
  from department
  join role on department.id = role.department_id;

-- select departments, the roles within the department and the employees working in corresponding department/roles
select
  department.name as "Department",
  role.title as "Role",
  concat(employee.first_name, ' ', employee.last_name) as "Employee"
  from employee
  join role on employee.role_id = role.id
  join department on role.department_id = department.id;

-- select department and their total salaries
select
  department.name as "Department",
  sum(role.salary) as "Salary"
  from role
  join department on role.department_id = department.id
  where department.id = 2
  group by department.name;

select
  employee.id,
  employee.first_name,
  employee.last_name
  from employee
  join role on employee.role_id = role.id
  join department on role.department_id = department_id
  where employee.manager_id is null;

select 
  e1.*
  from employee e1
  inner join (
    select distinct
      manager_id
      from employee
  ) e2 on e2.manager_id = e1.id
union
select *
from employee
where manager_id is null;

select 
  employee.id as "ID",
  concat(employee.first_name, ' ', employee.last_name) as "Manager"
  from employee
  where employee.manager_id is null;


async function getManagerList() {
  try {
    const managerData = await pool.query(
      `SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee WHERE manager_id IS NULL`
    );
    return managerData.rows.map((employee) => ({
      name: employee.name,
      value: employee.id,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}