-- select
--   department.id as "ID",
--   department.name as "Department"
-- from department;

-- select 
--   role.id as "ID", 
--   role.title as "Title", 
--   department.name as "Department",
--   role.salary as "Salary"
-- from role
-- join department on role.department_id  = department.id;

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

-- select 
--   concat(e1.first_name, ' ', e1.last_name) as "Name",
--   concat(e2.first_name, ' ', e2.last_name) as "Manager"
--   from employee e1
--   left join employee e2 on e1.manager_id = e2.id;


