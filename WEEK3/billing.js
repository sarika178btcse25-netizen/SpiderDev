function runBillingSystem() {
    let processAnotherCustomer = true;
    let customerCount = 1;

    // BONUS 3: Outer loop allows calculating bills for multiple customers
    while (processAnotherCustomer) {
        let cart = []; // Array to store all products for the current customer
        let subtotal = 0;
        
        // Variables for BONUS 2: Tracking most expensive product
        let highestPrice = 0;
        let mostExpensiveProduct = "";

        let addingProducts = true;

        console.log(`\n--- Starting Bill for Customer #${customerCount} ---`);

        // Core Req: Loop to calculate final bill for multiple products
        while (addingProducts) {
            // Core Req: Take product name, quantity, and price
            let pName = prompt(`Customer ${customerCount} | Enter product name:`);
            let pPrice = parseFloat(prompt(`Enter price for ${pName}:`));
            let pQty = parseInt(prompt(`Enter quantity for ${pName}:`), 10);

            // Validation check (Ensures valid math calculations later)
            if (isNaN(pPrice) || isNaN(pQty) || pPrice < 0 || pQty < 0) {
                alert("Invalid price or quantity. Please enter positive numbers.");
                continue; // Skips to the next iteration of the loop
            }

            // Core Req: Calculate item total
            let itemTotal = pPrice * pQty;
            subtotal += itemTotal; // Add to overall bill

            // BONUS 2: Track highest price
            if (pPrice > highestPrice) {
                highestPrice = pPrice;
                mostExpensiveProduct = pName;
            }

            // Store product details in the cart array for the formatted bill later
            cart.push({ name: pName, price: pPrice, qty: pQty, total: itemTotal });

            // Ask if they want to add more products
            let moreStr = prompt("Add another product for this customer? (type 'yes' or 'no')").toLowerCase();
            if (moreStr !== 'yes' && moreStr !== 'y') {
                addingProducts = false;
            }
        }

        // Core Req: Apply discounts using if/else based on subtotal
        let discountPercent = 0;
        if (subtotal >= 2000) {
            discountPercent = 15; // 15% discount for bills over $2000
        } else if (subtotal >= 1000) {
            discountPercent = 10; // 10% discount for bills over $1000
        } else if (subtotal >= 500) {
            discountPercent = 5;  // 5% discount for bills over $500
        } else {
            discountPercent = 0;
        }

        let discountAmount = (subtotal * discountPercent) / 100;
        let totalAfterDiscount = subtotal - discountAmount;

        // BONUS 1: Calculate GST (e.g., 10% standard tax)
        const GST_RATE = 10; 
        let gstAmount = (totalAfterDiscount * GST_RATE) / 100;
        let finalGrandTotal = totalAfterDiscount + gstAmount;

        // Core Req: Use switch to display payment method details
        let payMethod = prompt("Enter payment method (Cash, UPI, Card):").toLowerCase().trim();
        let payMessage = "";
        let displayMethod = "";

        switch (payMethod) {
            case "cash":
                displayMethod = "CASH";
                payMessage = "Please tender exact change at the counter.";
                break;
            case "upi":
                displayMethod = "UPI";
                payMessage = "Scan the QR code on the terminal to complete payment.";
                break;
            case "card":
                displayMethod = "CREDIT/DEBIT CARD";
                payMessage = "Please insert or tap your card on the machine.";
                break;
            default:
                displayMethod = "OTHER";
                payMessage = "Please proceed to customer service desk for processing.";
                break;
        }

        // BONUS 1: Generate a formatted bill
        console.log("=========================================");
        console.log(`        SUPERMART INVOICE - CUST #${customerCount}     `);
        console.log("=========================================");
        console.log("ITEMS PURCHASED:");
        
        // Loop through the saved cart to print each item
        for(let i = 0; i < cart.length; i++) {
            let item = cart[i];
            console.log(` - ${item.name}: ${item.qty} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}`);
        }
        
        console.log("-----------------------------------------");
        console.log(`Subtotal:                  $${subtotal.toFixed(2)}`);
        console.log(`Discount (${discountPercent}%):            -$${discountAmount.toFixed(2)}`);
        console.log(`Total after Discount:      $${totalAfterDiscount.toFixed(2)}`);
        console.log(`GST Tax (${GST_RATE}%):             +$${gstAmount.toFixed(2)}`);
        console.log("-----------------------------------------");
        console.log(`GRAND TOTAL:               $${finalGrandTotal.toFixed(2)}`);
        console.log("=========================================");
        
        // Displaying Bonus 2 and Switch Statement results
        if (cart.length > 0) {
            console.log(`Most Expensive Item: ${mostExpensiveProduct} ($${highestPrice.toFixed(2)})`);
        }
        console.log(`Payment Selected:    ${displayMethod}`);
        console.log(`Instructions:        ${payMessage}`);
        console.log("=========================================\n");

        // BONUS 3: Ask to start the loop over for a new customer
        let nextCustomerStr = prompt("Calculate bill for the next customer? (type 'yes' or 'no')").toLowerCase();
        if (nextCustomerStr === 'yes' || nextCustomerStr === 'y') {
            customerCount++;
        } else {
            processAnotherCustomer = false;
            console.log("System shutting down. Have a great day!");
        }
    }
}

// Call the function to start the application
runBillingSystem();