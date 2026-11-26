
// Load Navbar
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;

        loadCategories();
        updateAuthIcon();
        updateCartCounter();
        checkAdmin();
    })
    .catch(error => console.log("Error loading navbar:", error));


// Load Footer
fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(error => console.log("Error loading footer:", error));


// Category Images
let categoryImages = {
    "Tops": "images/tops.jpg",
    "Pants": "images/pants.jpg",
    "Skirts": "images/skirts.jpg",
    "Dresses": "images/dresses.jpg"
};


// Load Categories
function loadCategories() {

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Category",

        success: function (categories) {

            // Display categories in navbar
            let navCategories = document.getElementById("navCategories");

            if (navCategories) {
                navCategories.innerHTML = "";

                categories.forEach(function (category) {
                    navCategories.innerHTML += `
                        <li>
                            <a href="products.html?cat=${category.CategoryID}">
                                ${category.CategoryName}
                            </a>
                        </li>
                    `;
                });
            }

            // Display categories on homepage
            let categoryCards = document.getElementById("categoryCards");

            if (categoryCards) {
                categoryCards.innerHTML = "";

                categories.forEach(function (category) {
                    categoryCards.innerHTML += `
                        <article>
                            <a href="products.html?cat=${category.CategoryID}">
                                <img src="${categoryImages[category.CategoryName]}" alt="${category.CategoryName}">
                                <div>
                                    <h3>${category.CategoryName}</h3>
                                    <span>SHOP NOW</span>
                                </div>
                            </a>
                        </article>
                    `;
                });
            }
        },

        error: function (error) {
            console.log("Error loading categories:", error);
        }
    });
}


// Login / Logout User Menu
function updateAuthIcon() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let authIcon = document.getElementById("authIcon");

    if (user) {

        $.ajax({
            type: "GET",
            url: "http://localhost:59420/api/User/" + user.UserID,

            success: (response) => {
                authIcon.innerHTML = `
                    <div class="user-dropdown">
                        <button type="button"
                                class="user-menu-btn"
                                title="Account Menu"
                                onclick="toggleUserDropdown(event)">
                            <i class="fa-solid fa-bars-staggered"></i>
                        </button>

                        <div class="user-dropdown-menu" id="userDropdownMenu">

                            <div class="user-dropdown-header">
                                <span class="user-welcome">Welcome,</span>
                                <strong class="user-name">${response.UserName}</strong>
                            </div>

                            <div class="user-dropdown-divider"></div>

                            <a href="orders.html" class="user-dropdown-item">
                                <i class="fa-solid fa-clock-rotate-left"></i>
                                Order History
                            </a>

                            <button type="button"
                                    class="user-dropdown-item logout-btn"
                                    onclick="logoutUser()">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                Logout
                            </button>

                        </div>
                    </div>
                `;
            },

            error: (err) => console.log(err)
        });

    }
    else {
        authIcon.innerHTML = `
            <a href="#" onclick="goToLogin()" title="Login" class="user-menu-btn">
                <i class="fa-solid fa-user"></i>
            </a>
        `;
    }
}


// Toggle User Dropdown
function toggleUserDropdown(event) {

    if (event) {
        event.stopPropagation();
    }

    const dropdownMenu = document.getElementById("userDropdownMenu");

    if (dropdownMenu) {
        dropdownMenu.classList.toggle("show");
    }
}


// Close User Dropdown Outside
window.addEventListener("click", (event) => {

    const dropdownMenu = document.getElementById("userDropdownMenu");
    const dropdownBtn = document.querySelector(".user-menu-btn");

    if (dropdownMenu && dropdownMenu.classList.contains("show") &&
        !dropdownMenu.contains(event.target) &&
        (!dropdownBtn || !dropdownBtn.contains(event.target))) {

        dropdownMenu.classList.remove("show");
    }
});


// Logout User
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}


// Update Cart Counter
function updateCartCounter() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let cartCount = document.getElementById("cart-count");
    let cartIcon = document.querySelector(".bag-link");

    if (user === null) {
        cartIcon.style.display = "none";
        return;
    }

    cartIcon.style.display = "inline-flex";

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Cart/" + user.UserID,

        success: (cart) => {

            if (cartCount) {
                let totalQty = 0;

                cart.forEach(item => totalQty += item.CartQty);

                cartCount.textContent = totalQty;
            }
        },

        error: (err) => console.log(err)
    });
}


// Go to Login with Current Page
function goToLogin() {

    let fullPath = window.location.pathname;
    let currentPage = fullPath.split("/").pop();

    window.location.href = "login.html?returnUrl=" + currentPage;
}


// Show Dashboard Link Only for Admin
function checkAdmin() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let adminButton = document.getElementById("adminDashboardLink");

    if (!adminButton) {
        return;
    }

    adminButton.style.display = "none";

    if (!user) {
        return;
    }

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/User/" + user.UserID,

        success: function (response) {

            if (response.TypeID == 1) {
                adminButton.style.display = "inline-flex";
            }
        },

        error: function (error) {
            console.log("Admin check error:", error);
        }
    });
}
