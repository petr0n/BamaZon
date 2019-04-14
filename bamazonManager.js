let mysql = require('mysql');
let inquirer = require('inquirer');
let chalk = require('chalk');
let Table = require('cli-table');

console.log('Welcome to BamaZon - the BtoZ store!');

// db connection 
let conn = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'o7kLUrUb18gdzQzu',
    database: 'bamazon'
});

conn.connect(function (err) {
    if (err) throw err;
    initStore();
});

function shopAgain(){
    inquirer.prompt([
        {
            name: "again",
            type: "list",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ],
            message: 'Want to continue shopping?',
            validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }])
    .then(function(answer) {
        if (answer.again == 'Yes, I need more stuff'){
            initStore();
        } else {
            console.log('Thanks for shopping at BamaZon - Come again!');
        }
    });
}

