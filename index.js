const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const { Console } = require('console');
// const { Console } = require('console');


// Connect to DB function
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'kwikCMS_db'
    },
)
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

    // space at the end of the table
    console.log("\n");

    // now that the data has been output to the screen
    // present the user with the menu
    init();

}
const viewAllEmployees = () => {
    // Query Employees table
    db.query('SELECT * FROM employee;', (err, result) => (err) ? console.log(err) : renderQueryResult(result));
}
const addEmployee = async (newEmployee) => {

    // Add user to the database
    try {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, ?, ?);", [newEmployee.fname, newEmployee.lname, newEmployee.role, newEmployee.manager], (err, result) => {
            if (err) {
                return false;
            }
        })
    } catch (error) {
        return false;
    }
    return true;

}

const updateEmployeeRole = () => {
    db.query(`UPDATE employee SET first_name="?", last_name="?", role_id=?, manager_id=?;`, emp, (err, result) => (err) ? console.log(err) : console.log(result));

}
const ViewAllRoles = () => {
    // Query database
    db.query('SELECT * FROM role;', (err, result) => (err) ? console.log(err) : renderQueryResult(result));

}
const addRole = (newRole) => {

    inquirer
        .prompt([
            /* Add Role - 1 of 3 - title */
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'title',
            },
            /* Add Role - 2 of 3 - salary */
            {
                type: 'input',
                message: 'What is the salary for the role?',
                name: 'salary',
            },
            /* Add Role - 3 of 3 - department_id */
            {
                type: 'input',
                message: 'Which department does the role belong to?',
                name: 'dept',
            },
        ])
        .then((answer) => {

            // Hardcoded query: INSERT for new Role to be added to the Role table
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ( "?", ?, ?);`, answer.title, answer.salary, dept, (err, result) => (err) ? console.log(err) : console.log(result));

        })
        .catch((err) => {
            (err.isTtyError) ? console.log("No prompt!") : console.log("Not sure!");
        });

}
const viewAllDepartments = () => {

    // Query database
    db.query('SELECT * FROM department;', (err, result) => (err) ? console.log(err) : renderQueryResult(result));
}
const AddDepartment = (dpt) => {
    // Hardcoded query: INSERT for new Role to be added to the Role table
    db.query("INSERT INTO department (title, salary, department_id) VALUES ( ?, ?, ?);", dpt, (err, result) => (err) ? console.log(err) : console.log(result));
}
const showMainMenu = () => {

    return inquirer
        .prompt([
            /* Present CLI menu options for Main Menu */
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'menu_option',
                choices: mainMenu,
                pageSize: 7,
                loop: true
            }
        ])
}
const getFromDB = async (tableToLookIn, fieldToRetrieve, whereField, whereValue) => {

    // console.log(fieldToRetrieve, " ", tableToLookIn);

    // send a promise back so we ensure the value is received in time
    return new Promise((resolve, reject) => {

        // create query string "FROM tablename" part
        let queryString = " FROM " + tableToLookIn;

        if (typeof fieldToRetrieve === "object") {

            // if more than one field was requested add the first
            queryString = fieldToRetrieve[0] + queryString;
            // add the fields second onwards to query string
            for (let i = 1; i < fieldToRetrieve.length; i++) {
                queryString = fieldToRetrieve[i] + ", " + queryString;
            }
        } else {
            // add the one and only field to retrieve in SELECT
            queryString = fieldToRetrieve + queryString;
        }

        // add the SELECT part of the query string
        queryString = "SELECT " + queryString;

        // if there is a WHERE clause, add it
        if (whereField) {
            // select column from table... following adds to this
            if (typeof (whereField) === "object") {
                // if more than one field was requested, add the first to the where clause
                queryString = `${queryString} WHERE ${whereField[0]} = "${whereValue[0]}" AND `;
                for (let i = 1; i < (whereField.length - 1); i++) {
                    // add 2nd parameter onwards (if length is more than 2, otherwise this is skipped)
                    queryString = `${queryString} ${whereField[i]} = "${whereValue[i]}"`;
                }
                // add the last parameter for the where and terminate query string to prep for execution
                queryString = `${queryString} ${whereField[whereField.length - 1]} = "${whereValue[whereField.length - 1]}";`;
            } else {
                // add the only parameter in the where and prep for execution
                queryString = `${queryString} WHERE ${whereField} = "${whereValue}";`
            }
        } else {
            // no where field, terminate the statement for execution
            queryString = queryString + ";";
        }
        console.log(queryString);
        let arrToReturn = [];

        // get results from DB
        db.query(queryString, (err, rowsRetrieved) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(rowsRetrieved);

            if (typeof fieldToRetrieve === "object") {
                for (let i = 0; i < fieldToRetrieve.length; i++) {
                    for (let j = 0; j < rowsRetrieved.length; j++) {
                        arrToReturn.push(Object.values(rowsRetrieved[j])[i]);
                    }
                }
            } else {
                for (let i = 0; i < rowsRetrieved.length; i++) {
                    arrToReturn.push(Object.values(rowsRetrieved[i])[0]);
                }
            }
            console.log(arrToReturn);
            resolve(arrToReturn);
        });
    });
}
const showAddEmployeeMenu = async () => {

    let allRolesTitles = [];
    let allFullEmpNames = [];
    let temp_EmpNames = [];

    // allRolesTitles =  Array.from(Object.values(getFromDB("title", "role")));
    allRolesTitles = await getFromDB("role", ["title"], null, null);
    temp_EmpNames = await getFromDB("employee", ["first_name", "last_name"], null, null);

    console.log(temp_EmpNames);
    // since the list is all firstnames and then all lastnames in a 1-d array
    let fullNameCount = temp_EmpNames.length / 2;
    for (i = 0; i < fullNameCount; i++) {
        allFullEmpNames[i] = temp_EmpNames[i + fullNameCount] + " " + temp_EmpNames[i];
    }

    console.log(allRolesTitles);
    console.log(allFullEmpNames);

    return inquirer
        /* Present CLI menu options for Add User */
        .prompt([
            /* Add Employee - 1 of 3 - first name */
            {
                type: 'input',
                message: `What is the employee's first name?`,
                name: 'fname',
            },
            /* Add Employee - 2 of 3 - last name */
            {
                type: 'input',
                message: `What is the employee's last name?`,
                name: 'lname',
            },
            /* Add Employee - 2 of 3 - role */
            {
                type: 'list',
                message: `What is the employee's role`,
                name: 'role',
                choices: allRolesTitles,
                pageSize: 7,
                loop: true
            },
            /* Add Manager - 3 of 3 - manager*/
            {

                type: 'list',
                message: `Who is the employee's manager`,
                name: 'manager',
                choices: allFullEmpNames,
                pageSize: 7,
                loop: true
            },
        ])
}

// IIFE to handle async call for intialization
(async () => {

    let quitApp = false;

    while (!quitApp) {

        try {

            console.log("0 - starting");
            const answers = await showMainMenu();
            console.log('The answers are: ', answers);
            switch (answers.menu_option) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    let newEmployee = await showAddEmployeeMenu();
                    let roleID = await getFromDB("role", "id", "title", newEmployee.role);
                    let managerFirstName = newEmployee.manager.slice(0, newEmployee.manager.indexOf(' '));
                    let managerLastName = newEmployee.manager.slice((newEmployee.manager.indexOf(' ') + 1), newEmployee.manager.length);

                    let managerID = await getFromDB("employee", "id", ["first_name", "last_name"], [managerFirstName, managerLastName]);

                    newEmployee.role = roleID;
                    newEmployee.manager = managerID;

                    console.log(newEmployee);

                    let addedToDatabase = await addEmployee(newEmployee);
                    if (addedToDatabase) {
                        console.log("Added " + newEmployee.fname + " " + newEmployee.lname + "to the database");
                    } else {
                        console.log("Cound not add " + newEmployee.fname + " " + newEmployee.lname + "to the database");
                    }
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    ViewAllRoles();
                    break;
                case "Add Role":
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    AddDepartment();
                    break;
                case "Quit":
                    console.log("\nGood Bye!\n");
                    quitApp = true;

                // process.exit();
            }
            console.log('Done switch for: ', answers.menu_option);
        } catch (err) {
            console.error(`There was an error while talking to the API: ${err.message}`, err);
        }
    }
    console.log('Done TRY');
})();
