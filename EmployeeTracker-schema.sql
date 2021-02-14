DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL (10,2),
  department_id INT,
  PRIMARY KEY (id)
  -- FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
INSERT INTO employee (first_name, last_name)
VALUES ("N/A", "N/A");

INSERT INTO role (title, salary, department_id)
VALUES ('Project Manager', 175000.00),
	   ('Business Lead', 155000.00),
       ('Business Analyst - Senior', 145000.00),
       ('Business Analyst - Mid', 122000.00),
       ('Business Analyst - Jr', 75000.00),
       ('Infrastructure Lead', 160000.00),
       ('Facilities Manager', 110000.00),
       ('QA Lead', 115000.00),
       ('Technical Lead', 170000.00),
       ('Developer - Senior', 160000.00),
       ('Developer - Mid', 145000.00),
       ('Developer - Jr', 80000.00);

INSERT INTO department (name)
VALUES ('Project Management'),
	   ('Information Technology'),
	   ('Business Analysis'),
       ('Facilities');

