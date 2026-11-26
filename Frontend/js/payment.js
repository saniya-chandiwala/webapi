$(document).ready(function () {


    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user == null) {
        window.location.href = "login.html";
        return;
    }

    // Load user details
    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/User/" + user.UserID,
        success: (response) => {
            $("#fullName").val(response.UserName);
            $("#emailAddress").val(response.UserEmail);
        },
        error: (err) => {
            console.log(err);
            alert("Error loading customer details.");
        }
    });

    // Load cart
    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/Cart/" + user.UserID,
        success: (response) => {

            if (response.length == 0) {
                alert("Your cart is empty.");
                window.location.href = "products.html";
                return;
            }

            let grandTotal = 0;
            let summaryItems = "";

            response.forEach((item) => {

                let itemTotal =
                    item.Product.ProductPrice * item.CartQty;

                grandTotal += itemTotal;

                summaryItems += `
                <div class="summary-item">
                    <div class="summary-item-info">
                        <h4 class="summary-item-title">
                            ${item.Product.ProductName}
                        </h4>
                        <span class="summary-item-qty">
                            Qty: ${item.CartQty}
                        </span>
                    </div>
                    <span class="summary-item-price">
                        ₹ ${itemTotal.toLocaleString("en-IN")}
                    </span>
                </div>
            `;
            });

            $("#summaryItemsList").html(summaryItems);

            $("#summarySubtotal").text("₹ " + grandTotal.toLocaleString("en-IN"));

            $("#summaryGrandTotal").text("₹ " + grandTotal.toLocaleString("en-IN"));
        },
        error: (err) => {
            console.log(err);
            alert("Error loading cart.");
        }
    });

    // Pay Now
    $("#payNowBtn").click(() => {

        let fullName = $("#fullName").val().trim();
        let email = $("#emailAddress").val().trim();
        let phone = $("#phoneNumber").val().trim();
        let address = $("#streetAddress").val().trim();
        let city = $("#city").val().trim();
        let state = $("#state").val().trim();
        let pincode = $("#pincode").val().trim();

        let cardNumber = $("#cardNumber").val().trim();
        let cardExpiry = $("#cardExpiry").val().trim();
        let cardCvv = $("#cardCvv").val().trim();

        // Shipping validation
        if (
            fullName == "" || email == "" ||
            phone.length != 10 || isNaN(phone) ||
            address == "" || city == "" || state == "" ||
            pincode.length != 6 || isNaN(pincode)
        ) {
            alert("Please enter valid shipping details.");
            return;
        }

        // Card validation
        if (
            cardNumber.length != 16 || isNaN(cardNumber) ||
            cardExpiry.length != 5 || 
            cardExpiry.charAt(2) != "/" ||
            isNaN(cardExpiry.substring(0, 2)) ||
            isNaN(cardExpiry.substring(3, 5)) ||
            Number(cardExpiry.substring(0, 2)) < 1 ||
            Number(cardExpiry.substring(0, 2)) > 12 ||
            cardCvv.length != 3 || isNaN(cardCvv)
        ) {
            alert("Please enter valid card details.");
            return;
        }


        // Disable button to prevent double payment
        $("#payNowBtn").prop("disabled", true);

        // Create order
        $.ajax({
            type: "POST",
            url: "http://localhost:59420/api/Bill/" + user.UserID,
            success: (response) => {

                console.log("Bill response:", response);

                if (response == false) {
                    alert("Unable to place order.");
                    $("#payNowBtn").prop("disabled", false);
                    return;
                }

                alert("Payment Successful!");

                window.location.href = "orders.html";
            },
            error: (err) => {
                console.log("Bill error:", err);
                alert("Payment failed.");
                $("#payNowBtn").prop("disabled", false);
            }
        });

    });


});
