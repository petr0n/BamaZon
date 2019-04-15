let mysql = require('mysql');
let inquirer = require('inquirer');
let chalk = require('chalk');
let Table = require('cli-table');

console.log('Welcome to BamaZon Product Managment tool');

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
    init();
});

function init(){
    inquirer.prompt([
        {
            name: "todo",
            type: "list",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ],
            message: 'What do you want to do?'
        }
    ])
    .then(function(answer) {
        console.log(answer.todo);
        switch(answer.todo) {
            case 'View Products for Sale':
                viewProducts('');
                break;
            case 'View Low Inventory':
                viewProducts('low');
                break;
            case 'Add to Inventory':
                updateProduct();
                break;
            case 'Add New Product':
                addProduct();
                break;
        }
    });
}

function viewProducts(qryType){
    let table = new Table({
        head: [
            'ProductId',
            'Product Name',
            'Dept',
            'Price',
            'Qty']
    });
    let query = 'SELECT * FROM products';
    if (qryType == 'low') {
        query = 'SELECT * FROM products WHERE stock_quantity < 5';
    }
    conn.query(query, function (err, res) {
        if (err) { console.log(err); }
        if (res.length == 0) {
            console.log('No products found');
        } else {
            res.map(function(row) {
                let productRow = [row.product_id, row.product_name, row.department_name, '$' + row.sale_price, row.stock_quantity];
                table.push(productRow);
            });
            console.log(table.toString());
        }
        init();
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


function updateProduct(){
    console.log('What would you like to update?');
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
                console.log('You chose: ' + productArr[1]);
                // console.log(productArr);
                updateQty(productArr);
            })
            .catch(function(err){
                console.log('Error: ' + err);
                whatProduct();
            });
    });
}



function updateQty(productArr){
    console.log('How many do you want to add?');
    inquirer.prompt([
        {
            name: "qty",
            type: "input",
            message: "Quantity?",
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
        let remainingQty = productArr[4] + answer.qty;
        let query = 'UPDATE products SET stock_quantity = ? WHERE product_id = ?';
        conn.query(query, [parseInt(qty), productId], function (err, res) {
            if (err) { console.log(err); }
            // console.log('Quantity updated');
            // console.log(res);
            console.log('Success! You have purchased ' + answer.qty + ' ' + productArr[1] + 's for a total price of $' + totalPrice.toFixed(2) );
            init();
        });
    });
}

function addProduct() {

}