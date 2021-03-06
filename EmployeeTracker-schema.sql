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
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ('Project Management'),
	     ('Information Technology'),
	     ('Business Analysis'),
       ('Facilities');

INSERT INTO role (title, salary, department_id)
VALUES ('Project Manager', 175000.00, 1),
	     ('Business Lead', 155000.00, 3),
       ('Business Analyst - Senior', 145000.00, 3),
       ('Business Analyst - Mid', 122000.00, 3),
       ('Business Analyst - Jr', 75000.00, 3),
       ('Infrastructure Lead', 160000.00, 4),
       ('Facilities Manager', 110000.00, 4),
       ('QA Lead', 115000.00, 4),
       ('Technical Lead', 170000.00, 2),
       ('Developer - Senior', 160000.00, 2),
       ('Developer - Mid', 145000.00, 2),
       ('Developer - Jr', 80000.00, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ashley", "Stith", 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Erika", "Stith", 2, 1),
       ("Kwame", "Amoah", 6, 2),
       ("Joshua", "Brown", 7, 3),
       ("Brittany", "Johnson", 8, 3)





