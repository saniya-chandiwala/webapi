
// Check logged-in user and load their orders
$(document).ready(function () {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user == null) {
        window.location.href = "login.html";
        return;
    }

    loadOrders(user.UserID);
});


// Load all orders of the logged-in user
function loadOrders(userID) {

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Bill/" + userID,

        success: (orders) => {

            let container = document.getElementById("ordersContentWrapper");

            // Show empty state when user has no orders
            if (orders.length == 0) {
                container.innerHTML = `
                    <div class="empty-orders">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        <h2>No orders yet</h2>
                        <p>Your completed orders will appear here.</p>
                        <a href="products.html">SHOP COSTUMES</a>
                    </div>
                `;
                return;
            }

            // Sort newest orders first
            orders.sort((a, b) => new Date(b.BillDate) - new Date(a.BillDate));

            let orderHTML = new Array(orders.length);
            let completed = 0;

            // Load details for every order
            orders.forEach((order, index) => {

                $.ajax({
                    type: "GET",
                    url: "http://localhost:59420/api/BillDetails/" + order.BillID,

                    success: (details) => {

                        // Create HTML for all products in this order
                        let itemsHTML = "";

                        details.forEach((item) => {
                            itemsHTML += `
                                <div class="order-item">
                                    <div class="order-item-left">
                                        <img src="${item.Product.ProductImage}" alt="${item.Product.ProductName}" class="order-item-thumb">
                                        <div class="order-item-info">
                                            <h3>${item.Product.ProductName}</h3>
                                            <span>Qty: ${item.Qty}</span>
                                        </div>
                                    </div>
                                    <strong>₹ ${item.TotalAmt.toLocaleString('en-IN')}</strong>
                                </div>
                            `;
                        });

                        // Create HTML for the complete order
                        orderHTML[index] = `
                            <div class="order-card">
                                <div class="order-top">
                                    <div>
                                        <span class="order-label">ORDER #${order.BillID}</span>
                                        <h2>₹ ${order.TotalBill.toLocaleString('en-IN')}</h2>
                                    </div>

                                    <div class="order-date">
                                        <span>${new Date(order.BillDate).toLocaleDateString('en-IN')}</span>
                                        <span>Paid by ${order.PaymentMode}</span>
                                    </div>
                                </div>

                                <div class="order-divider"></div>

                                <div class="order-items">
                                    ${itemsHTML}
                                </div>

                                <div class="order-divider"></div>

                                <div class="order-total">
                                    <span>TOTAL</span>
                                    <strong>₹ ${order.TotalBill.toLocaleString('en-IN')}</strong>
                                </div>
                            </div>
                        `;

                        completed++;

                        // Display orders only after every order's details are loaded
                        if (completed == orders.length) {
                            container.innerHTML = orderHTML.join("");
                        }
                    },

                    error: (err) => console.log(err)
                });
            });
        },

        // Handle order loading error
        error: (err) => {
            console.log(err);
            alert("Error loading order history.");
        }
    });
}
