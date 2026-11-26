
// Load admin details and categories
$(document).ready(() => {

    loadAdminEmail();
    loadCategories();

    $("#btnSave").click(() => {
        addProduct();
    });
});


// Load logged-in admin email
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


// Load categories into dropdown
function loadCategories() {

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Category",

        success: (categories) => {

            let select = $("#productCategory");

            categories.forEach((category) => {
                select.append(`
                    <option value="${category.CategoryID}">
                        ${category.CategoryName}
                    </option>
                `);
            });
        },

        error: (err) => {
            console.log(err);
            alert("Unable to load categories.");
        }
    });
}


// Add new product
function addProduct() {

    let name = $("#productName").val().trim();
    let categoryID = $("#productCategory").val();
    let price = $("#productPrice").val();
    let stock = $("#productStock").val();
    let image = $("#productImage").val().trim();
    let description = $("#productDesc").val().trim();

    // Validate required fields

    // Validate product details
    if (
        name == "" ||
        categoryID == null ||
        price == "" || stock == "" ||
        image == "" ||
        isNaN(price) || Number(price) <= 0 ||
        isNaN(stock) || Number(stock) < 0
    ) {
        alert("Please enter valid product details.");
        return;
    }



    let product = {
        CategoryID: Number(categoryID),
        ProductName: name,
        ProductPrice: Number(price),
        ProductQty: Number(stock),
        ProductDescription: description,
        ProductImage: image
    };

    // Save product
    $.ajax({
        type: "POST",
        url: "http://localhost:59420/api/Product",
        data: product,

        success: () => {
            alert("Product added successfully!");
            $("#productForm")[0].reset();
        },

        error: (err) => {

            console.log(err);

            if (err.status == 409) {
                alert("A product with this name already exists.");
            }
            else {
                alert("Unable to add product.");
            }
        }
    });
}


// Logout admin
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}
