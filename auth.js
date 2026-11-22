 
// ======================================
// LARPTIX - LOGIN / LOGOUT NAVBAR
// ======================================

const authButton = document.getElementById("auth-btn");

if (authButton) {

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );
    } catch (error) {
        currentUser = null;
    }

    if (currentUser && currentUser.identifier) {

        // USER IS LOGGED IN
        authButton.textContent = "LOGOUT";

        authButton.onclick = function () {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmLogout) return;

            // CLEAR ACTIVE SESSION
            localStorage.removeItem("currentUser");

            // CLEAR TEMPORARY CHECKOUT DATA
            localStorage.removeItem("selectedBookingIndex");
            localStorage.removeItem("paymentData");

            // KEEP SAVED BOOKINGS INTACT
            window.location.href = "index.html";
        };

    } else {

        // USER IS LOGGED OUT
        authButton.textContent = "LOGIN";

        authButton.onclick = function () {
            window.location.href = "login.html";
        };

    }

}
