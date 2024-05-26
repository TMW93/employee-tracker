drop database if exists employees_db;
create database employees_db;

\c employees_db;

create table department (
  id serial primary key,
  name varchar(30) unique not null
);

create table role (
  id serial primary key,
  title varchar(30) unique not null,
  salary decimal not null,
  department_id integer not null,

  foreign key (department_id)
  references department(id)
  on delete set null
);

create table employee (
  id serial primary key,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id integer not null,
  manager_id integer,

  foreign key (role_id)
  references role(id)
  on delete set null,

  foreign key (manager_id)
  references employee(id)
  on delete set null
);