let mysql = require('mysql');
let inquirer = require('inquirer');
let chalk = require('chalk');
let Table = require('cli-table');

let welcome = `
--------------------------------------------------------------
*                                                            *
*                                                            *
*           Welcome to BamaZon - the BtoZ store!             *
*                                                            *
*                                                            *
--------------------------------------------------------------
`;
console.log(chalk.yellow(welcome));

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

let consoleHR = `---------------------------------------------
`;

function initStore() {
    getProducts();
}

function getProducts() {
    let table = new Table({
        head: [
            'ProductId',
            'Product Name',
            'Dept',
            'Price',
            'Qty'],
        // colWidths: [100, 200, 100, 100, 100]
    });
    let query = 'SELECT * FROM products';
    conn.query(query, function (err, res) {
        if (err) { console.log(err); }
        res.map(function(row) {
            let productRow = [row.product_id, row.product_name, row.department_name, '$' + row.sale_price, row.stock_quantity];
            table.push(productRow);
        });
        console.log(table.toString());
        whatProduct();
    });
}

function getProduct(productId) {
    return new Promise(function(resolve, reject) {
        if (!isNaN(productId)) {
            let query = 'SELECT * FROM products WHERE ?';
            conn.query(query, {product_id: productId}, function (err, res) {
                if (err) { console.log(err); }
                // console.log(res);
                if (res.length) {
                    let product = [
                        res[0].product_id, 
                        res[0].product_name, 
                        res[0].department_name, 
                        res[0].sale_price, 
                        res[0].stock_quantity
                    ];
                    resolve(product);
                } else {
                    reject('product is not found');
                }
            });
        } else {
            reject('invalid product id');
        }
    });
}


function whatProduct(){
    console.log(chalk.yellow(consoleHR));
    console.log(chalk.cyanBright('What would you like to add to your cart?\n'));
    inquirer.prompt([
        {
            name: "productId",
            type: "input",
            message: "Product Id?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        getProduct(answer.productId)
            .then(function(productArr){
                console.log(chalk.yellow('You chose: ' + productArr[1]));
                // console.log(productArr);
                whatQty(productArr);
            })
            .catch(function(err){
                console.log(chalk.red('Error: ' + err));
                whatProduct();
            });
    });
}

function whatQty(productArr){
    console.log(chalk.yellow(consoleHR));
    console.log(chalk.cyanBright('How many do you want to buy?\n'));
    inquirer.prompt([
        {
            name: "qty",
            type: "input",
            message: "Stock Quantity?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        let totalPrice = productArr[3] * answer.qty;
        let remainingQty = productArr[4] - answer.qty;
        // console.log(remainingQty);
        if (remainingQty >= 0) { // success
            updateProduct(productArr[0], remainingQty);
            console.log(chalk.whiteBright('\n' + consoleHR));
            console.log(chalk.green.bold('Success! You\'ve added ' + answer.qty + ' ' + productArr[1] + 's to your cart.'));
            console.log(chalk.whiteBright.bold('Total price of $' + totalPrice.toFixed(2)));
            console.log(chalk.whiteBright('\n' + consoleHR));
            shopAgain();
        } else { // error
            console.log(chalk.red('\n' + consoleHR));
            console.log(chalk.redBright.bold('Not enough available. Try again.'));
            console.log(chalk.red('\n' + consoleHR));
            whatQty(productArr);
        }
    });
}

function shopAgain(){
    // console.log(chalk.yellow(consoleHR));    
    inquirer.prompt([
        {
            name: "again",
            type: "list",
            choices: [
                'Yes, I need more stuff',
                'No, I have enough stuff'
            ],
            message: 'Want to continue shopping?'
        }
    ])
    .then(function(answer) {
        if (answer.again == 'Yes, I need more stuff'){
            initStore();
        } else {
            console.log(chalk.yellow('\n' + consoleHR));
            console.log(chalk.yellowBright('Thanks for shopping at BamaZon - Come again!'));
            console.log(chalk.yellow('\n' + consoleHR));
            conn.destroy()
        }
    });
}

function updateProduct(productId, qty) {
    let query = 'UPDATE products SET stock_quantity = ? WHERE product_id = ?';
    conn.query(query, [parseInt(qty), productId], function (err, res) {
        if (err) { console.log(err); }
        // console.log('Quantity updated');
        // console.log(res);
    });
}