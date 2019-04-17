# Bamazon
Your BtoZ store

This is a console app that allows users to either visit the store as a customer or visit the store as a manager.


There are two different entry points, `bamazonCustomer.js` and `bamazonManager.js`. 

## bamazonCustomer.js 
Allows users to:
* view all products in the store 
* add products to their cart


### Behind the scenes 
This app pulls data from a database and outputs it in tabular format. 
    
When a user adds a product to their cart, the inventory of that product is reduced and the total of those items is displayed to the user.
    
After adding an item to their cart users are prompted to keep shopping or quit.


## Preview App
![alt text](https://raw.githubusercontent.com/petr0n/BamaZon/master/images/bamazonCustomerJS.gif "Bamazon Customer App")


__________

## bamazonManager.js 
Allows managers to:
* view all products in the store 
* view products low on inventory
* increase inventory of selected product
* add new products to store


### Behind the scenes 
This app pulls data from a database and outputs it in tabular format.

A manager can view products with low inventory - less than 10 items.

A manager can add to a product inventory using a UPDATE statement.

New products can be added to the store using the INSERT statement.

-------

## Packages Used
This app uses the following packages
* Inquirer - allows user to enter data
* Chalk - styles console log 
* mysql - allows db interaction in JS using Node
* cli-table - for nicer looking CLI tables


## Preview App

![alt text](https://raw.githubusercontent.com/petr0n/BamaZon/master/images/bamazonManagerJS.gif "Bamazon Manager App")
