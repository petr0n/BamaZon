// product constructor 

function Product(){
    this.producId = 0;
    this.productName = 'Widget 1';
    this.departmentId = '';
    this.sale_price = 9.99;
    this.cost_price = 7;
    this.qty = 0;

    // removes from inventory and return total purchase price
    this.purchaseProduct = function(purchaseQty) {
        newQty = purchaseQty - this.qty;
        if (newQty < 0) {
            return 'err';
        } else {
            this.qty = newQty;
            return this.sale_price * newQty;
        }
    }

}