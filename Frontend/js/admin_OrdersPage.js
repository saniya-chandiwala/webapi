let allOrders = [];
let allUsers = [];


// Load admin details and orders
$(document).ready(() => {

    loadAdminEmail();
    loadOrders();

    $("#orderSearchInput").on("input", searchOrders);

    $("#closeOrderModalBtn").click(() => {
        $("#orderDetailsModal").hide();
    });

    $("#orderDetailsModal").click(function (event) {
        if (event.target == this) {
            $("#orderDetailsModal").hide();
        }
    });

    // View order
    $("#ordersTableBody").on("click", ".view-order-btn", function () {

        let order = allOrders.find((x) => {
            return x.BillID == this.getAttribute("data-id");
        });

        if (order != null) {
            showOrderDetails(order);
        }
    });

    // Select item from dropdown
    $("#orderEmailDropdown").on("click", ".order-email-option", function () {

        let id = this.getAttribute("data-id");
        let type = this.getAttribute("data-type");

        $("#orderEmailDropdown").hide();

        if (type == "order") {

            let order = allOrders.find((x) => {
                return x.BillID == id;
            });

            if (order != null) {
                $("#orderSearchInput").val("Order #" + order.BillID);
                displayOrders([order]);
            }
        }
        else {

            let user = allUsers.find((x) => {
                return x.UserID == id;
            });

            if (user != null) {
                $("#orderSearchInput").val(user.UserEmail);
                displayUserOrders(user.UserID);
            }
        }
    });
});


// Load and verify admin
function loadAdminEmail() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user == null) {
        window.location.href = "login.html";
        return;
    }

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/User/" + user.UserID,

        success: (response) => {

            if (response.TypeID != 1) {
                alert("Access denied.");
                window.location.href = "index.html";
                return;
            }

            $("#adminEmail").text(response.UserEmail);
        },

        error: (err) => {
            console.log(err);
            alert("Unable to verify admin.");
            window.location.href = "index.html";
        }
    });
}


// Load orders and users
function loadOrders() {

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Bill",

        success: (orders) => {

            allOrders = orders;

            $.ajax({
                type: "GET",
                url: "http://localhost:59420/api/User",

                success: (users) => {

                    allUsers = users;

                    allOrders.forEach((order) => {

                        let user = allUsers.find((u) => {
                            return u.UserID == order.UserID;
                        });

                        order.UserName = user ? user.UserName : "Unknown User";
                        order.UserEmail = user ? user.UserEmail : "";
                    });

                    updateOrderStats();

                    $("#ordersTableBody").empty();
                    $("#ordersEmptyState").hide();
                },

                error: (err) => {
                    console.log(err);
                    alert("Unable to load users.");
                }
            });
        },

        error: (err) => {
            console.log(err);
            alert("Unable to load orders.");
        }
    });
}


// Update statistics
function updateOrderStats() {

    let totalRevenue = allOrders.reduce((total, order) => {
        return total + Number(order.TotalBill);
    }, 0);

    $("#statTotalOrders").text(allOrders.length);
    $("#statTotalRevenue").text("₹ " + totalRevenue.toLocaleString("en-IN"));
}


// Search by Order ID or Email
function searchOrders() {

    let searchText = $("#orderSearchInput").val().trim().toLowerCase();

    if (searchText == "") {
        $("#orderEmailDropdown").hide();
        $("#ordersTableBody").empty();
        $("#ordersEmptyState").hide();
        return;
    }

    // Search orders
    let orders = allOrders.filter((order) => {
        return order.BillID.toString().includes(searchText);
    });

    if (orders.length > 0) {

        let items = orders.map((order) => {
            return {
                id: order.BillID,
                text: "Order #" + order.BillID,
                type: "order"
            };
        });

        displayDropdown(items);
        return;
    }

    // Search users
    let users = allUsers.filter((user) => {
        return user.UserEmail.toLowerCase().includes(searchText);
    });

    let items = users.map((user) => {
        return {
            id: user.UserID,
            text: user.UserEmail,
            type: "user"
        };
    });

    displayDropdown(items);

    $("#ordersTableBody").empty();
    $("#ordersEmptyState").hide();
}


// Display dropdown
function displayDropdown(items) {

    let dropdown = $("#orderEmailDropdown");

    dropdown.empty();

    if (items.length == 0) {
        dropdown.hide();
        return;
    }

    items.forEach((item) => {

        dropdown.append(`
            <div class="order-email-option"
                 data-id="${item.id}"
                 data-type="${item.type}">
                ${item.text}
            </div>
        `);
    });

    dropdown.show();
}


// Display selected user's orders
function displayUserOrders(userID) {

    let orders = allOrders.filter((order) => {
        return order.UserID == userID;
    });

    displayOrders(orders);
}


// Display orders
function displayOrders(orders) {

    let tbody = $("#ordersTableBody");

    tbody.empty();

    if (orders.length == 0) {
        $("#ordersEmptyState").show();
        return;
    }

    $("#ordersEmptyState").hide();

    orders.forEach((order) => {

        let orderDate = new Date(order.BillDate)
            .toLocaleDateString("en-IN");

        tbody.append(`
            <tr>

                <td><strong>#${order.BillID}</strong></td>

                <td>
                    <div class="user-cell">
                        <div>
                            <p class="user-name-title">${order.UserName}</p>
                            <span>${order.UserEmail}</span>
                        </div>
                    </div>
                </td>

                <td>${orderDate}</td>

                <td>${order.PaymentMode}</td>

                <td style="text-align: right;">
                    <strong>
                        ₹ ${Number(order.TotalBill).toLocaleString("en-IN")}
                    </strong>
                </td>

                <td style="text-align: right;">
                    <button type="button"
                            class="view-order-btn"
                            data-id="${order.BillID}">
                        View
                    </button>
                </td>

            </tr>
        `);
    });
}


// Show order details
function showOrderDetails(order) {

    $("#modalOrderTag").text("ORDER #" + order.BillID);
    $("#modalCustomerName").text(order.UserName);
    $("#modalOrderDate").text(
        new Date(order.BillDate).toLocaleDateString("en-IN")
    );
    $("#modalOrderPayment").text(order.PaymentMode);
    $("#modalOrderTotal").text(
        "₹ " + Number(order.TotalBill).toLocaleString("en-IN")
    );

    $("#modalOrderItems").html("<p>Loading items...</p>");
    $("#orderDetailsModal").show();

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/BillDetails/" + order.BillID,

        success: (details) => {

            let html = "";

            details.forEach((item) => {

                html += `
                    <div class="order-item">
                        <div>
                            <strong>${item.Product.ProductName}</strong>
                            <span>Qty: ${item.Qty}</span>
                        </div>

                        <strong>
                            ₹ ${Number(item.TotalAmt).toLocaleString("en-IN")}
                        </strong>
                    </div>
                `;
            });

            $("#modalOrderItems").html(
                html || "<p>No items found for this order.</p>"
            );
        },

        error: (err) => {
            console.log(err);
            $("#modalOrderItems").html(
                "<p>Unable to load order items.</p>"
            );
        }
    });
}


// Logout admin
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}
