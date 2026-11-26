$(document).ready(() => {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    // Check login
    if (user == null) {
        window.location.href = "login.html";
        return;
    }

    // Check admin access
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
});


// Logout admin
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}
