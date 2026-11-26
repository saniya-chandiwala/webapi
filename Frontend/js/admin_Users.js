
let allUsers = [];


// Load admin details and users
$(document).ready(() => {

    loadAdminEmail();
    loadUsers();

    // Change user role filter
    $("#roleFilter").change(() => {
        $("#userSearchInput").val("");
        $("#usersTableBody").html("");
        showUserSearchResults();
    });

    // Show users when search box is focused
    $("#userSearchInput").focus(() => {
        showUserSearchResults();
    });

    // Search users while typing
    $("#userSearchInput").on("input", () => {
        showUserSearchResults();
    });

    // Hide dropdown when clicking outside
    $(document).click((event) => {
        if (!$(event.target).closest(".search-input-wrap").length) {
            $("#userDropdown").hide();
        }
    });

    // Select user from dropdown
    $("#userDropdown").on("click", function (event) {

        let userID = event.target.getAttribute("data-id");
        let selectedUser = allUsers.find(x => x.UserID == userID);

        if (selectedUser == null) {
            return;
        }

        displayUsers([selectedUser]);
        $("#userSearchInput").val(selectedUser.UserEmail);
        $("#userDropdown").hide();
    });
});


// Load logged-in admin details
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


// Load all users
function loadUsers() {

    $.ajax({
        type: "GET",
        url: "http://localhost:59420/api/User",

        success: (users) => {
            allUsers = users;
            updateUserStats();
            $("#usersTableBody").html("");
        },

        error: (err) => {
            console.log(err);
            alert("Unable to load users.");
        }
    });
}


// Update user statistics
function updateUserStats() {

    let totalUsers = allUsers.length;
    let totalCustomers = allUsers.filter(user => user.TypeID == 2).length;
    let totalAdmins = allUsers.filter(user => user.TypeID == 1).length;

    $("#statTotalUsers").text(totalUsers);
    $("#statTotalCustomers").text(totalCustomers);
    $("#statTotalAdmins").text(totalAdmins);
}


// Filter users for search dropdown
function showUserSearchResults() {

    let selectedRole = $("#roleFilter").val();
    let searchText = $("#userSearchInput").val().trim().toLowerCase();

    let filteredUsers = allUsers.filter((user) => {

        let roleMatches =
            selectedRole == "all" ||
            (selectedRole == "Admin" && user.TypeID == 1) ||
            (selectedRole == "User" && user.TypeID == 2);

        let searchMatches =
            user.UserName.toLowerCase().includes(searchText) ||
            user.UserEmail.toLowerCase().includes(searchText) ||
            user.UserID.toString().includes(searchText);

        return roleMatches && searchMatches;
    });

    showUsers(filteredUsers);
}


// Display users in search dropdown
function showUsers(users) {

    let dropdown = $("#userDropdown");

    dropdown.html("");

    if (users.length == 0) {
        dropdown.html("<div class='product-dropdown-item'>No users found</div>");
        dropdown.show();
        return;
    }

    users.forEach((user) => {

        let item = $("<div>");

        item.addClass("product-dropdown-item");
        item.attr("data-id", user.UserID);
        item.text(user.UserEmail);

        dropdown.append(item);
    });

    dropdown.show();
}


// Display selected user in table
function displayUsers(users) {

    let tbody = $("#usersTableBody");

    tbody.empty();

    if (users.length == 0) {
        $("#usersEmptyState").show();
        return;
    }

    $("#usersEmptyState").hide();

    users.forEach((user) => {

        let roleName = user.TypeID == 1 ? "Admin" : "Customer";

        tbody.append(`
            <tr>
                <td>#${user.UserID}</td>

                <td>
                    <span class="user-name-title">${user.UserName}</span>
                </td>

                <td>${user.UserEmail}</td>

                <td style="text-align: right;">
                    <span class="role-badge ${user.TypeID == 1 ? "admin" : "user"}">
                        ${roleName}
                    </span>
                </td>
            </tr>
        `);
    });
}


// Logout admin
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}
