
// Get logged-in user's cart
function getCart(callback) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Cart/" + user.UserID,

        success: (response) => callback(response),

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });
}


// Display cart
function displayCart() {
    getCart((cart) => {

        let container = document.getElementById("cartContentWrapper");
        let cartHeader = document.querySelector(".cart-header");

        if (cart.length == 0) {
            cartHeader.style.display = "none";

            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <h2>Your bag is empty</h2>
                    <p>Add some items to your bag and they'll appear here.</p>
                    <a href="products.html">SHOP COSTUMES</a>
                </div>
            `;

            return;
        }

        cartHeader.style.display = "block";

        let totalBill = 0;
        let html = "";

        cart.forEach((item) => {

            // Reduce cart quantity if current stock is lower
            if (item.CartQty > item.Product.ProductQty) {
                item.CartQty = item.Product.ProductQty;

                $.ajax({
                    type: "PUT",
                    url: "http://localhost:59420/api/Cart",
                    data: {
                        CartID: item.CartID,
                        CartQty: item.CartQty
                    },
                    success: () => displayCart(),
                    error: (err) => console.log(err)
                });
            }

            let itemTotal = item.Product.ProductPrice * item.CartQty;
            totalBill += itemTotal;

            // Disable + button when available stock is reached
            let plusButton = item.CartQty >= item.Product.ProductQty
                ? `<button type="button" disabled>+</button>`
                : `<button type="button" onclick="increaseQty(${item.CartID})">+</button>`;

            html += `
                <div class="cart-card">

                    <img src="${item.Product.ProductImage}" alt="${item.Product.ProductName}">

                    <div class="cart-info">

                        <span class="cart-category">${item.Product.Category.CategoryName}</span>

                        <h3 class="cart-title">${item.Product.ProductName}</h3>

                        <p class="cart-desc">${item.Product.ProductDescription || ""}</p>

                        <div class="cart-actions">

                            <div class="qty-pill">
                                <button type="button" onclick="decreaseQty(${item.CartID})">-</button>
                                <span>${item.CartQty}</span>
                                ${plusButton}
                            </div>

                            <button type="button"
                                    class="remove-btn"
                                    onclick="removeItem(${item.CartID})">
                                <i class="fa-solid fa-xmark"></i>
                            </button>

                            <span class="cart-price">
                                ₹ ${itemTotal.toLocaleString('en-IN')}
                            </span>

                        </div>

                    </div>

                </div>
            `;
        });

        // Display cart summary
        container.innerHTML = `
            <div class="cart-layout">

                <div class="cart-items">
                    ${html}
                </div>

                <div class="cart-summary">

                    <h2>ORDER SUMMARY</h2>

                    <div class="summary-row">
                        <span>Subtotal</span>
                        <strong>₹ ${totalBill.toLocaleString('en-IN')}</strong>
                    </div>

                    <div class="summary-row">
                        <span>Shipping</span>
                        <strong class="free-badge">FREE</strong>
                    </div>

                    <div class="summary-divider"></div>

                    <div class="summary-total">
                        <span>TOTAL</span>
                        <strong>₹ ${totalBill.toLocaleString('en-IN')}</strong>
                    </div>

                    <button type="button"
                            class="checkout-btn"
                            onclick="proceedToPayment()">
                        PROCEED TO PAYMENT
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                </div>

            </div>
        `;
    });
}


// Go to payment page
function proceedToPayment() {
    window.location.href = "payment.html";
}


// Increase cart quantity
function increaseQty(id) {
    getCart((cart) => {

        let item = cart.find(x => x.CartID === id);

        if (item == null) {
            return;
        }

        if (item.CartQty >= item.Product.ProductQty) {
            alert("Available stock reached.");
            return;
        }

        item.CartQty++;

        $.ajax({
            type: "PUT",
            url: "http://localhost:59420/api/Cart",
            data: {
                CartID: item.CartID,
                CartQty: item.CartQty
            },

            success: (response) => {

                if (response == false) {
                    alert("Available stock reached.");
                    displayCart();
                    return;
                }

                displayCart();
                updateCartCounter();
            },

            error: (err) => console.log(err)
        });
    });
}


// Decrease cart quantity
function decreaseQty(id) {
    getCart((cart) => {

        let item = cart.find(x => x.CartID === id);

        if (item.CartQty > 1) {

            item.CartQty--;

            $.ajax({
                type: "PUT",
                url: "http://localhost:59420/api/Cart",
                data: {
                    CartID: item.CartID,
                    CartQty: item.CartQty
                },

                success: () => {
                    displayCart();
                    updateCartCounter();
                },

                error: (err) => {
                    alert(err);
                    console.log(err);
                }
            });
        }
        else {
            removeItem(id);
        }
    });
}


// Remove item from cart
function removeItem(id) {
    $.ajax({
        type: "DELETE",
        url: "http://localhost:59420/api/Cart/" + id,

        success: () => {
            displayCart();
            updateCartCounter();
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });
}


// Load cart when page opens
$(document).ready(() => {

    if (localStorage.getItem("loggedInUser")) {
        displayCart();
    }
    else {
        window.location.href = "login.html";
    }

});
