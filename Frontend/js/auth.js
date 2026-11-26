
// Handle Login and Signup forms
$(document).ready(() => {

    $("#loginForm").submit((event) => {
        event.preventDefault();
        loginUser();
    });

    $("#signupForm").submit((event) => {
        event.preventDefault();
        signupUser();
    });
});


// Login user
function loginUser() {

    let email = $("#loginEmail").val();
    let password = $("#loginPassword").val();

    $.ajax({
        type: "POST",
        url: "http://localhost:59420/api/Login",

        data: {
            UserEmail: email,
            UserPassword: password
        },

        success: (user) => {

            if (user == null) {
                alert("Invalid email or password.");
                return;
            }

            localStorage.setItem("loggedInUser", JSON.stringify(user));

            let params = new URLSearchParams(window.location.search);
            let returnUrl = params.get("returnUrl");
            let pendingProduct = JSON.parse(
                sessionStorage.getItem("pendingProduct")
            );

            // Add pending product after login
            if (pendingProduct) {

                $.ajax({
                    type: "POST",
                    url: "http://localhost:59420/api/Cart",

                    data: {
                        UserID: user.UserID,
                        ProductID: pendingProduct.ProductID,
                        CartQty: 1,
                        Price: pendingProduct.ProductPrice
                    },

                    success: (response) => {

                        if (response == false) {
                            alert("Product is out of stock or available quantity has been reached.");
                            sessionStorage.removeItem("pendingProduct");
                            return;
                        }

                        sessionStorage.removeItem("pendingProduct");

                        if (returnUrl) {
                            window.location.href = returnUrl;
                        }
                        else {
                            window.location.href = "products.html";
                        }
                    },

                    error: (err) => {
                        console.log("Add to cart error:", err);
                        alert("Unable to add product to cart.");
                    }
                });

                return;
            }

            // Redirect based on user type
            if (user.TypeID == 1) {
                window.location.href = "admin_Dashboard.html";
            }
            else if (returnUrl) {
                window.location.href = returnUrl;
            }
            else {
                window.location.href = "index.html";
            }
        },

        error: (err) => {
            console.log("Login error:", err);
            alert("Unable to login.");
        }
    });
}


// Register new customer
function signupUser() {

    let name = $("#signupName").val().trim();
    let email = $("#signupEmail").val().trim();
    let password = $("#signupPassword").val();
    let confirmPassword = $("#signupConfirmPassword").val();

    // Check passwords
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:59420/api/Register",

        data: {
            UserName: name,
            UserEmail: email,
            UserPassword: password
        },

        success: (response) => {

            if (response == false) {
                alert("Email already registered.");
                return;
            }

            alert("Account created successfully!");
            window.location.href = "login.html";
        },

        error: (err) => {
            console.log("Signup error:", err);
            alert("Unable to create account.");
        }
    });
}
