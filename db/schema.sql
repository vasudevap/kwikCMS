-- create database kwikCMS
DROP DATABASE IF EXISTS kwikCMS_db;
CREATE DATABASE kwikCMS_db;

USE kwikCMS_db;

-- create table department
-- field- id: INT PRIMARY KEY
-- field- name: VARCHAR(30) to hold department name
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

-- create table role
-- field- id: INT PRIMARY KEY
-- field- title: VARCHAR(30) to hold role title
-- field- salary: DECIMAL to hold role salary
-- field- department_id: INT to hold reference to department role belongs to
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET DEFAULT
);

-- create table employee
-- field- id: INT PRIMARY KEY
-- field- first_name: VARCHAR(30) to hold employee first name
-- field- last_name: VARCHAR(30) to hold employee last name
-- field- role_id: INT to hold reference to employee role
-- field- manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  ON UPDATE CASCADE ON DELETE SET DEFAULT,

  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
  ON UPDATE CASCADE ON DELETE SET NULL
);