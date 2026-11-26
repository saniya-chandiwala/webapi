
// Load products when page opens
$(document).ready(function () {
    loadProducts();
});


// Load categories and set page title
function loadProducts() {
    let params = new URLSearchParams(window.location.search);
    let categoryID = params.get("cat");

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Category",

        success: function (categories) {

            if (categoryID) {
                let category = categories.find(function (category) {
                    return category.CategoryID == categoryID;
                });

                if (category) {
                    document.getElementById("breadcrumbCategory").textContent = " / " + category.CategoryName;
                    document.getElementById("pageTitle").textContent = category.CategoryName;
                }
            }
            else {
                document.getElementById("breadcrumbCategory").textContent = " / All";
                document.getElementById("pageTitle").textContent = "All Items";
            }

            getProducts(categoryID);
        },

        error: function (error) {
            console.log("Error loading categories:", error);
        }
    });
}


// Load products and filter by category
function getProducts(categoryID) {
    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Product",

        success: function (products) {

            if (categoryID) {
                products = products.filter(function (product) {
                    return product.CategoryID == categoryID;
                });
            }

            displayProducts(products);
        },

        error: function (error) {
            console.log("Error loading products:", error);
        }
    });
}


// Display products with stock and add-to-cart button
function displayProducts(products) {
    let productsGrid = document.getElementById("productsGrid");

    productsGrid.innerHTML = "";
    document.querySelector(".product-count").textContent = "(" + products.length + ")";

    products.forEach(function (product) {

        let buttonHTML = "";
        let stockHTML = "";

        if (product.ProductQty == 0) {
            stockHTML = `
                <span class="product-stock out-stock">OUT OF STOCK</span>
            `;

            buttonHTML = `
                <button type="button" class="add-cart-btn" disabled>
                    OUT OF STOCK
                </button>
            `;
        }
        else {
            stockHTML = `
                <span class="product-stock">${product.ProductQty} available</span>
            `;

            buttonHTML = `
                <button type="button"
                        class="add-cart-btn"
                        onclick='addToCart(${JSON.stringify(product)})'>
                    <i class="fa-solid fa-cart-plus"></i>
                    ADD
                </button>
            `;
        }

        productsGrid.innerHTML += `
            <div class="product-card">

                <div class="product-thumb">
                    <img src="${product.ProductImage}" alt="${product.ProductName}">
                </div>

                <div class="product-body">

                    <span class="product-cat">${product.Category.CategoryName}</span>

                    <h3 class="product-name">${product.ProductName}</h3>

                    <p class="product-desc">${product.ProductDescription || ""}</p>

                    <div class="product-bottom">

                        <div>
                            <span class="product-price">₹${product.ProductPrice}</span>
                            ${stockHTML}
                        </div>

                        ${buttonHTML}

                    </div>

                </div>

            </div>
        `;
    });
}


// Add product to cart
function addToCart(product) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user === null) {
        alert("Please login first!");

        sessionStorage.setItem("pendingProduct", JSON.stringify(product));

        let fullPath = window.location.pathname;
        let currentPage = fullPath.split("/").pop();

        window.location.href = "login.html?returnUrl=" + currentPage;
        return;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:59420/api/Cart",
        
        data: {
            UserID: user.UserID,
            ProductID: product.ProductID,
            CartQty: 1,
            Price: product.ProductPrice
        },

        success: (response) => {

            if (response == false) {
                alert("Product is out of stock or available quantity has been reached.");
                return;
            }

            alert("Added to cart!");
            updateCartCounter();
        },

        error: (err) => {
            console.log(err);
            alert("Unable to add product to cart.");
        }
    });
}
