const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const { Console } = require('console');


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

const findColumnWidth = (data, column) => {

    // set max width to length of heading to start
    let maxColumnWidth = Array.from(Object.keys(data[0]))[column].length;
    // for each row
    for (let i = 0; i < data.length; i++) {
        // if its not null
        if (Array.from(Object.values(data[i]))[column]) {
            // get max width for requested column
            // by checking each entry in the column
            if (maxColumnWidth < Array.from(Object.values(data[i]))[column].length) {

                maxColumnWidth = Array.from(Object.values(data[i]))[column].length;

            }
        }
    }
    return maxColumnWidth;
}

const renderQueryResult = (dataToRender) => {

    let allHeadingsArr = Object.keys(dataToRender[0]);
    console.log('\n');

    // start the headings with a space
    let headingsToPrint = ' ';
    let headingsDivider_btm = ' ';
    let columnWidths = [];

    // for each column
    for (let i = 0; i < allHeadingsArr.length; i++) {
        //find max width of this 'i' column
        columnWidths.push(findColumnWidth(dataToRender, i));
    }

    // for every column
    for (let i = 0; i < allHeadingsArr.length; i++) {
        // add a space before and after each
        headingsToPrint = headingsToPrint + " " + allHeadingsArr[i] + " ";
        headingsDivider_btm = headingsDivider_btm + " ";
        for (let j = 0; j < (columnWidths[i] - allHeadingsArr[i].length); j++) {
            headingsToPrint = headingsToPrint + " ";
            headingsDivider_btm = headingsDivider_btm + "-";
        }
        for (let j = 0; j < allHeadingsArr[i].length; j++) {
            // create a bottom divider under each heading label
            headingsDivider_btm = headingsDivider_btm + "-";
        }
        headingsDivider_btm = headingsDivider_btm + " ";
    }

    // render the heading with column names
    console.log(headingsToPrint);

    // render the headings bottom border
    console.log(headingsDivider_btm);

    // render the data
    // for each row
    for (let i = 0; i < dataToRender.length; i++) {
        let tmp = [];
        let dataRowToPrint = ' ';

        // for each column
        for (let j = 0; j < columnWidths.length; j++) {
            // add a space between the columns
            dataRowToPrint = dataRowToPrint + ' ';
            // if the entry isn't null
            if (Object.values(dataToRender[i])[j]) {
                // add the column data to printout
                dataRowToPrint = dataRowToPrint + Object.values(dataToRender[i])[j];
                // calculate trailing empty spaces to complete column
                let spacesToAdd = columnWidths[j] - String(Object.values(dataToRender[i])[j]).length;
                tmp.push(Object.values(dataToRender[i])[j].length);
                for (let k = 0; k < spacesToAdd; k++) {
                    // add any trailing spaces to printout
                    dataRowToPrint = dataRowToPrint + " ";
                }
                dataRowToPrint = dataRowToPrint + ' ';
            } else {
                dataRowToPrint = dataRowToPrint + ' ';
            };
        }
        // print this row
        console.log(dataRowToPrint);
    }
    console.log("\n");
    init();

}

function viewAllEmployees() {
    // Query Employees table
    db.query('SELECT * FROM employee;', (err, result) => (err) ? console.log(err) : renderQueryResult(result));
}

const addEmployee = (newEmp) => {
    db.query("INSERT INTO employee (fname, lname, role, manager_id) VALUES ( ?, ?, ?, ?);", newEmp, (err, result) => (err) ? console.log(err) : console.log(result));
}

const updateEmployeeRole = (emp) => {
    db.query("UPDATE employee SET fname=?, lname=?, role=?, manager_id=?;", emp, (err, result) => (err) ? console.log(err) : console.log(result));

}
function ViewAllRoles() {
    // Query database
    db.query('SELECT * FROM role;', (err, result) => (err) ? console.log(err) : renderQueryResult(result));

}
function addRole(newRole) {

    // Hardcoded query: INSERT for new Role to be added to the Role table
    db.query("INSERT INTO role (title, salary, department_id) VALUES ( ?, ?, ?);", newRole, (err, result) => (err) ? console.log(err) : console.log(result));

}
const viewAllDepartments = () => {

    // Query database
    db.query('SELECT * FROM department;', (err, result) => (err) ? console.log(err) : renderQueryResult(result));
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
                    return;
            }
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
