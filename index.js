const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');


// Connect to DB function
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'kwikCMS_db'
    },
    console.log(`Connected to the kwikCMS_db database.`)
);

const mainMenu = [
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "View All Departments",
    "Add Department",
    "Quit"
];

let keepGoing = true;

function viewAllEmployees() {
    // Query Employees table
    db.query('SELECT * FROM employee;', (err, result) => (err) ? console.log(err) : console.log(JSON.stringify(result)));
}

const addEmployee = (newEmp) => {
    db.query("INSERT INTO employee (fname, lname, role, manager_id) VALUES ( ?, ?, ?, ?);", newEmp, (err, result) => (err) ? console.log(err) : console.log(result));
}

const updateEmployeeRole = (emp) => {
    db.query("UPDATE employee SET fname=?, lname=?, role=?, manager_id=?;", emp, (err, result) => (err) ? console.log(err) : console.log(result));

}
function ViewAllRoles() {
    // Query database
    db.query('SELECT * FROM role;', (err, result) => (err) ? console.log(err) : console.log(JSON.parse(result)));

}
function addRole(newRole) {

    // Hardcoded query: INSERT for new Role to be added to the Role table
    db.query("INSERT INTO role (title, salary, department_id) VALUES ( ?, ?, ?);", newRole, (err, result) => (err) ? console.log(err) : console.log(result));

}
const viewAllDepartments = () => {

    // Query database
    db.query('SELECT * FROM department;', (err, result) => (err) ? console.log(err) : console.log(result));
}

function AddDepartment(dpt) {
        // Hardcoded query: INSERT for new Role to be added to the Role table
        db.query("INSERT INTO department (title, salary, department_id) VALUES ( ?, ?, ?);", dpt, (err, result) => (err) ? console.log(err) : console.log(result));
}

const init = () => {

    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'menu_option',
                choices: mainMenu,
                pageSize: 7,
                loop: true
            }
        ])
        .then((choice) => {
            // Handle user's choice from main menu
            switch (choice.menu_option) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    ViewAllRoles();
                    break;
                case "Add Role":
                    let newRoleInfo = [];
                    inquirer
                        .prompt([
                            /* Add Role - title 1 of 3 */
                            {
                                type: 'input',
                                message: 'What is the name of the role?',
                                name: 'title',
                            }
                        ])
                        .then((answer) => {
                            // Add title to newRole array
                            newRoleInfo.push(answer.title);
                            inquirer
                                .prompt([
                                    /* Add Role - salary 2 of 3 */
                                    {
                                        type: 'input',
                                        message: 'What is the salary for the role?',
                                        name: 'salary',
                                    }
                                ])
                                .then((answer) => {
                                    // Add salary input to newRole array
                                    newRoleInfo.push(answer.salary);
                                    inquirer
                                        .prompt([
                                            /* Add Role - department_id 3 of 3 */
                                            {
                                                type: 'input',
                                                message: 'Which department does the role belong to?',
                                                name: 'dept',
                                            }
                                        ])
                                        .then((answer) => {
                                            // Handle user's choice from main menu
                                            newRoleInfo.push(answer.dept);
                                            // console.log(newRoleInfo);
                                            addRole(newRoleInfo);
                                        })
                                        .catch((err) => {
                                            (err.isTtyError) ? console.log("No prompt!") : console.log("Not sure!");
                                        })
                                })
                                .catch((err) => {
                                    (err.isTtyError) ? console.log("No prompt!") : console.log("Not sure!");
                                })
                        })
                        .catch((err) => {
                            (err.isTtyError) ? console.log("No prompt!") : console.log("Not sure!");
                        });

                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    AddDepartment();
                    break;
                case "Quit":
                    keepGoing = false;
                    break;
            }
            return;
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
                console.log("prompt not rendered");
            } else {
                // Something else went wrong
                console.log("something went wrong");

            }
        });
}

init();
