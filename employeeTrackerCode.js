const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employeesDB',

  multipleStatements: true

});

connection.connect((err) => {
    if (err) throw err;
    console.log("\nWelcome to the ACS Employee Tracker!\n")
    runSearch();
});

var roles = [];

const runSearch = () => {
    connection.query('SELECT * FROM role', (err, res) => {

            res.forEach(({title}) => {
                roles.push(title);
            });
            // console.log(roles); // Testing
    });

    inquirer
      .prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?\n',
        choices: [
          'View All Employees',
          'View All Employees By Department',
          'View All Employees By Manager',
          'Add Employee',
          'Remove Employee',
          'Remove Department',
          'Remove Role',
          'Update Employee Role',
          'Update Employee Manager',
          'View All Roles',
          'View Total Budget By Department'
        ],
      })
      .then((answer) => {

        switch (answer.action) {
            case 'View All Employees':
                allEmployees();
                break;

            case 'View All Employees By Department':
                byDepartment();
                break;

            case 'View All Employees By Manager':
                byManager();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Remove Department':
                removeDepartment();
                break;

            case 'Remove Role':
                removeRole();
                break;

            case 'Remove Employee':
                removeEmployee();
                break;

            case 'Update Employee Role':
                updateRole();
                break;

            case 'Update Employee Manager':
                updateManager();
                break;

            case 'View All Roles':
                allRoles();
                break;

            case 'View Total Budget By Department':
                totalBudget();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
      });
  };


const allEmployees = () => {

    const query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager from employee e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON department.id = role.department_id INNER JOIN employee m ON m.id = e.manager_id"

    connection.query(query, (err, res) => {

        if (err) throw err;

        console.table(res);

        runSearch();

    });

}

const byDepartment = () =>{
    const query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager from employee e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON department.id = role.department_id INNER JOIN employee m ON m.id = e.manager_id ORDER BY department.name"

    connection.query(query, (err, res) => {

        if (err) throw err;

        console.table(res);

        runSearch();

    });

}

const byManager = () =>{
    const query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager from employee e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON department.id = role.department_id INNER JOIN employee m ON m.id = e.manager_id ORDER BY manager"

    connection.query(query, (err, res) => {

        if (err) throw err;

        console.table(res);

        runSearch();

    });

}

const addEmployee = () => {

    connection.query("SELECT * FROM employee WHERE first_name NOT LIKE 'N/A'", (err, res) => {

    if (err) throw err;
    // console.log(res); // Testing

    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "What is the Employee's first name?",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the Employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the Employee's role?",
                choices (){
                    return roles;
                }
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the Employee's manager?",
                choices () {
                    const choiceArray = [];

                    res.forEach(({first_name, last_name}) => {

                    choiceArray.push(`${first_name} ${last_name}`);

                });

                return choiceArray;
                }
            }
        ])
        .then((answer) => {
            // console.log(answer);
            // console.log(answer.manager.split(" ")[0]);

            const query = 'SELECT id from role WHERE ?; SELECT id from employee WHERE ?';
            connection.query(query,
            [
                {title: answer.role},
                {first_name: answer.manager.split(" ")[0]}
            ], (err,res) => {

                const results = JSON.parse(JSON.stringify(res));
                // console.log(results); //Testing
                // console.log(results[0][0].id); Testing
                // console.log(results[1][0].id); Testing

                const query2 = 'INSERT INTO employee SET ?';
                connection.query(query2,
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: results[0][0].id,
                        manager_id: results[1][0].id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('Your employee was added successfully!');
                        runSearch();
                    }
                )

            });

        })


      });

}

const removeEmployee = () =>{
    const query = "SELECT CONCAT(first_name, ' ', last_name) AS employee from employee WHERE first_name NOT LIKE 'N/A'";

    connection.query(query, (err, res) =>{
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Which Employee do you want to remove?",
                    choices () {
                        const results = JSON.parse(JSON.stringify(res));
                        // console.log(results);
                        const choiceArray = [];

                        results.forEach(({employee}) => {

                        choiceArray.push(employee);

                    });

                    return choiceArray;
                    }
                }
            ])
            .then((answer) => {
                // console.log(answer.employee.split(" ")[0]); // Testing
                console.log('Removing employee...\n');
                connection.query(
                  'DELETE FROM employee WHERE ?',
                  {
                    first_name: answer.employee.split(" ")[0],
                  },
                  (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee deleted!\n`);
                    // Call runSearch AFTER the DELETE completes
                    runSearch();
                  }
                );
            })
    })

};

const removeDepartment = () =>{
    const query = "SELECT name from department";

    connection.query(query, (err, res) =>{
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'department',
                    type: 'list',
                    message: "Which Department do you want to remove?",
                    choices () {
                        // const results = JSON.parse(JSON.stringify(res));
                        // console.log(results);
                        const choiceArray = [];

                        res.forEach(({name}) => {

                        choiceArray.push(name);

                    });

                    return choiceArray;
                    }
                }
            ])
            .then((answer) => {
                // console.log(answer); // Testing
                console.log('Removing department...\n');
                connection.query(
                  'DELETE FROM department WHERE ?',
                  {
                    name: answer.department,
                  },
                  (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} department deleted!\n`);
                    // Call runSearch AFTER the DELETE completes
                    runSearch();
                  }
                );
            })
    })

};

const removeRole = () =>{
    const query = "SELECT title from role";

    connection.query(query, (err, res) =>{
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: "Which Role do you want to remove?",
                    choices () {
                        // const results = JSON.parse(JSON.stringify(res));
                        // console.log(results);
                        const choiceArray = [];

                        res.forEach(({title}) => {

                        choiceArray.push(title);

                    });

                    return choiceArray;
                    }
                }
            ])
            .then((answer) => {
                // console.log(answer); // Testing
                console.log('Removing role...\n');
                connection.query(
                  'DELETE FROM role WHERE ?',
                  {
                    title: answer.role,
                  },
                  (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} role deleted!\n`);
                    // Call runSearch AFTER the DELETE completes
                    runSearch();
                  }
                );
            })
    })

};

const updateRole = () => {
    const query = "SELECT first_name, last_name, role.title from employee INNER JOIN role ON role_id = role.id WHERE first_name NOT LIKE 'N/A'";

    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Which Employee's role do you want to update?",
                    choices () {
                        const results = JSON.parse(JSON.stringify(res));
                        // console.log(results);
                        const choiceArray = [];

                        res.forEach(({first_name, last_name}) => {

                        choiceArray.push(`${first_name} ${last_name}`);

                    });

                    return choiceArray;
                    }
                },
                {
                    name: 'role',
                    type: 'list',
                    message: "What is the Employee's role?",
                    choices (){
                        return roles;
                    }
                },
            ])
            .then((answer) => {
                connection.query("SELECT id from role WHERE title =?", [answer.role], (err,res) => {
                    console.log("Updating the role for " + answer.employee + " to " + answer.role);

                    const results = JSON.parse(JSON.stringify(res));

                    // console.log(results[0].id); // Testing

                    connection.query(
                    'UPDATE employee SET ? WHERE ?',

                        [
                            {
                              role_id: results[0].id ,
                            },
                            {
                              first_name: answer.employee.split(" ")[0],
                            },
                        ],
                          (err, res) => {
                            if (err) throw err;
                            console.log(`${res.affectedRows} products updated!\n`);
                            // Call runSearch AFTER the DELETE completes
                            runSearch();
                          }
                    );

                });
            })
    })

};

const updateManager = () => {
    const query = "SELECT DISTINCT e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager from employee e INNER JOIN employee m ON m.id = e.manager_id";

    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Which Employee's manager do you want to update?",
                    choices () {
                        // const results = JSON.parse(JSON.stringify(res));
                        // console.log(results);
                        const choiceArray = [];

                        res.forEach(({first_name, last_name}) => {

                        choiceArray.push(`${first_name} ${last_name}`);

                    });

                    return choiceArray;
                    }
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Who is the Employee's new manager?",
                    choices () {
                        // const results = JSON.parse(JSON.stringify(res));
                        // console.log(results); // Testing
                        const choiceArray = [];

                        res.forEach(({first_name, last_name}) => {

                        choiceArray.push(`${first_name} ${last_name}`);

                    });

                    return choiceArray;
                    }
                },
            ])
            .then((answer) => {
                // console.log(answer);
                connection.query("SELECT id from employee WHERE?", [{first_name:answer.manager.split(" ")[0]}], (err,res) => {
                    // console.log(res);

                    console.log("Updating the role for " + answer.employee + " to " + answer.role);

                    const results = JSON.parse(JSON.stringify(res));

                    // console.log(results[0].id); // Testing

                    connection.query(
                    'UPDATE employee SET ? WHERE ?',

                        [
                            {
                              manager_id: results[0].id ,
                            },
                            {
                              first_name: answer.employee.split(" ")[0],
                            },
                        ],
                          (err, res) => {
                            if (err) throw err;
                            console.log(`${res.affectedRows} products updated!\n`);
                            // Call runSearch AFTER the DELETE completes
                            runSearch();
                          }
                    );

                });
            })
    })

};

const allRoles = () => {
    const query = 'SELECT title, salary from role';

    connection.query(query, (err, res) => {
        if (err) throw err;

        const results = JSON.parse(JSON.stringify(res));
        console.table(results);

        runSearch();
    })
}

const totalBudget = () => {
    const query = "SELECT name from department";

    connection.query(query, (err, res) =>{
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'department',
                    type: 'list',
                    message: "Which Department do you want to see the budget for?",
                    choices () {
                        // const results = JSON.parse(JSON.stringify(res));
                        // console.log(results);
                        const choiceArray = [];

                        res.forEach(({name}) => {

                        choiceArray.push(name);

                    });

                    return choiceArray;
                    }
                }
            ])
            .then((answer) => {
                // console.log(answer); // Testing
                connection.query("SELECT id from department WHERE?", [{name:answer.department}], (err,res) => {
                    // console.log(res); // Testing

                    const results = JSON.parse(JSON.stringify(res));
                    // console.table(results);
                    connection.query(
                        "SELECT role.title, sum(role.salary), department.name AS department from role INNER JOIN department ON role.department_id = department.id WHERE ?",
                      {
                        department_id: results[0].id,
                      },
                      (err, res) => {
                        //   console.log(res) // Testing
                        const results = JSON.parse(JSON.stringify(res));
                        console.table(results);
                        if (err) throw err;
                        // console.log(`Total budget for the ${answer.department} is ${res}`);

                        runSearch();
                      }
                    );
                })
            })
    })

}