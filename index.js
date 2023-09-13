const inquirer = require('inquirer');
const fs = require('fs');

const mainMenu = [
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "View All Departments",
    "Add Department",
];

inquirer
    .prompt([
        /* Pass your questions in here */
        {
            type: 'input',
            message: 'What would you like to do?',
            name: 'menu_option',
        },
        {
            type: 'input',
            message: 'What languages do you know?',
            name: 'languages',
        },
        {
            type: 'input',
            message: 'What is your preferred method of communication?',
            name: 'communication',
        },
    ])
    .then((answers) => {
        // Use user feedback for... whatever!!
        console.log(answers.name);
        fs.writeFile('output.txt', `user input was: ${answers.name}\nUser knows: ${answers.languages}\ncomm prefs: ${answers.communication}`, (err) =>
            err ? console.error(err) : console.log("success")
        );
 

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