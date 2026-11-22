 
// ======================================
// LARPTIX - SECURE DEMO PAYMENT SYSTEM
// ======================================


// GET CURRENT LOGGED-IN USER

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        return null;
    }
}

let currentUser = getCurrentUser();


// HTML ELEMENTS

const paymentContainer = document.querySelector(".payment-container");
const paymentFields = document.getElementById("payment-fields");
const payButton = document.getElementById("pay-button");
const cancelButton = document.getElementById("cancel-payment");


// CHECK LOGIN

if (!currentUser || !currentUser.identifier) {
    window.location.replace("login.html");
}


// LOAD BOOKINGS

function getBookings() {
    try {
        const data = JSON.parse(localStorage.getItem("myBookings"));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

let bookings = getBookings();


// GET SELECTED BOOKING INDEX

const savedIndex = localStorage.getItem("selectedBookingIndex");

const selectedIndex =
    savedIndex === null ? -1 : Number(savedIndex);

let booking =
    Number.isInteger(selectedIndex) && selectedIndex >= 0
        ? bookings[selectedIndex]
        : null;


// CHECK BOOKING OWNERSHIP

if (!currentUser || !currentUser.identifier) {

    // Login redirect is already running.

} else if (!booking) {

    paymentContainer.innerHTML = `
        <h2>No booking found.</h2>
        <a href="index.html">BACK TO HOME</a>
    `;

} else if (booking.customerIdentifier !== currentUser.identifier) {

    paymentContainer.innerHTML = `
        <h2>Access Denied</h2>
        <p>This booking does not belong to your account.</p>
        <a href="my-bookings.html">GO TO MY BOOKINGS</a>
    `;

} else if (booking.paymentStatus === "PAID") {

    paymentContainer.innerHTML = `
        <h2>This booking has already been paid.</h2>
        <a href="confirmation.html">VIEW TICKET</a>
    `;

} else {

    // ======================================
    // CANCEL PAYMENT
    // ======================================

    if (cancelButton) {

        cancelButton.addEventListener("click", function () {

            const confirmCancel = confirm(
                "Are you sure you want to cancel payment? Your booking will remain pending."
            );

            if (!confirmCancel) {
                return;
            }

            // Booking is NOT deleted.
            // Payment status remains PENDING.

            window.location.href = "my-bookings.html";

        });

    }


    // ======================================
    // DISPLAY BOOKING DETAILS
    // ======================================

    document.getElementById("pay-movie").textContent =
        booking.movie || "-";

    document.getElementById("pay-date").textContent =
        booking.date || "-";

    document.getElementById("pay-time").textContent =
        booking.time || "-";

    document.getElementById("pay-screen").textContent =
        booking.screen || "Standard";

    document.getElementById("pay-seats").textContent =
        Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : booking.seats || "-";

    document.getElementById("pay-total").textContent =
        booking.total ?? 0;


    // ======================================
    // PAYMENT METHOD OPTIONS
    // ======================================

    const paymentOptions = document.querySelectorAll(
        'input[name="payment"]'
    );


    // ======================================
    // SHOW PAYMENT FIELDS
    // ======================================

    function showPaymentFields(method) {

        if (method === "UPI") {

            paymentFields.innerHTML = `
                <label>Enter UPI ID</label>
                <input
                    type="text"
                    id="upi-id"
                    placeholder="example@upi"
                >
            `;

        } else if (method === "Credit / Debit Card") {

            paymentFields.innerHTML = `
                <label>Cardholder Name</label>
                <input
                    type="text"
                    id="card-name"
                    placeholder="Cardholder name"
                >

                <label>Card Number</label>
                <input
                    type="text"
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    inputmode="numeric"
                >

                <label>Expiry Date</label>
                <input
                    type="text"
                    id="card-expiry"
                    placeholder="MM/YY"
                    maxlength="5"
                >

                <label>CVV</label>
                <input
                    type="password"
                    id="card-cvv"
                    placeholder="123"
                    maxlength="4"
                    inputmode="numeric"
                >
            `;

        } else if (method === "Net Banking") {

            paymentFields.innerHTML = `
                <label>Select Your Bank</label>
                <select id="bank-name">
                    <option value="">Choose Bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                </select>
            `;

        } else if (method === "Wallet") {

            paymentFields.innerHTML = `
                <label>Select Wallet</label>
                <select id="wallet-name">
                    <option value="">Choose Wallet</option>
                    <option>Paytm</option>
                    <option>Amazon Pay</option>
                    <option>PhonePe</option>
                </select>
            `;

        }
    }


    // ======================================
    // PAYMENT METHOD CHANGE
    // ======================================

    paymentOptions.forEach(function (option) {

        option.addEventListener("change", function () {
            showPaymentFields(this.value);
        });

    });


    // ======================================
    // DEFAULT PAYMENT METHOD
    // ======================================

    const defaultOption = document.querySelector(
        'input[name="payment"]:checked'
    );

    showPaymentFields(
        defaultOption ? defaultOption.value : "UPI"
    );


    // ======================================
    // VALIDATE PAYMENT DETAILS
    // ======================================

    function validatePayment(method) {

        if (method === "UPI") {

            const upi = document.getElementById("upi-id").value.trim();

            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upi)) {
                alert("Please enter a valid demo UPI ID.");
                return false;
            }
        }


        if (method === "Credit / Debit Card") {

            const name = document.getElementById("card-name").value.trim();

            const number = document.getElementById("card-number")
                .value.replace(/\s/g, "");

            const expiry = document.getElementById("card-expiry").value.trim();

            const cvv = document.getElementById("card-cvv").value.trim();


            if (!name || !/^\d{16}$/.test(number)) {
                alert("Enter a name and a 16-digit demo card number.");
                return false;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                alert("Enter expiry in MM/YY format.");
                return false;
            }

            if (!/^\d{3,4}$/.test(cvv)) {
                alert("Enter a valid demo CVV.");
                return false;
            }
        }


        if (
            method === "Net Banking" &&
            !document.getElementById("bank-name").value
        ) {
            alert("Please select a bank.");
            return false;
        }


        if (
            method === "Wallet" &&
            !document.getElementById("wallet-name").value
        ) {
            alert("Please select a wallet.");
            return false;
        }

        return true;
    }


    // ======================================
    // PROCESS DEMO PAYMENT
    // ======================================

    let paymentProcessing = false;

    payButton.addEventListener("click", function () {

        if (paymentProcessing) {
            return;
        }


        // CHECK LOGIN AGAIN

        const activeUser = getCurrentUser();

        if (
            !activeUser ||
            activeUser.identifier !== booking.customerIdentifier
        ) {
            alert("Please login with the correct account.");
            window.location.href = "login.html";
            return;
        }


        // CHECK PAYMENT METHOD

        const selectedOption = document.querySelector(
            'input[name="payment"]:checked'
        );

        if (!selectedOption) {
            alert("Please select a payment method.");
            return;
        }


        const method = selectedOption.value;

        if (!validatePayment(method)) {
            return;
        }


        // START PROCESSING

        paymentProcessing = true;

        payButton.disabled = true;
        payButton.textContent = "PROCESSING...";

        if (cancelButton) {
            cancelButton.disabled = true;
        }


        // SIMULATE PAYMENT PROCESSING

        setTimeout(function () {


            // CHECK USER AGAIN

            const latestUser = getCurrentUser();

            if (
                !latestUser ||
                latestUser.identifier !== booking.customerIdentifier
            ) {
                alert("Your session changed. Please login again.");
                window.location.href = "login.html";
                return;
            }


            // GET LATEST BOOKINGS

            const updatedBookings = getBookings();


            // FIND EXACT BOOKING

            const bookingIndex = updatedBookings.findIndex(
                function (item) {
                    return (
                        item.bookingId === booking.bookingId &&
                        item.customerIdentifier === latestUser.identifier
                    );
                }
            );


            if (bookingIndex === -1) {

                alert("Booking not found or access denied.");

                paymentProcessing = false;
                payButton.disabled = false;
                payButton.textContent = "PAY NOW";

                if (cancelButton) {
                    cancelButton.disabled = false;
                }

                return;
            }


            // CHECK PAYMENT STATUS AGAIN

            if (updatedBookings[bookingIndex].paymentStatus === "PAID") {

                alert("This booking has already been paid.");
                window.location.href = "confirmation.html";
                return;
            }


            // MARK BOOKING AS PAID

            updatedBookings[bookingIndex].paymentStatus = "PAID";


            try {

                // SAVE UPDATED BOOKINGS

                localStorage.setItem(
                    "myBookings",
                    JSON.stringify(updatedBookings)
                );


                // SAVE SELECTED BOOKING INDEX

                localStorage.setItem(
                    "selectedBookingIndex",
                    String(bookingIndex)
                );


                // SAVE DEMO PAYMENT INFORMATION

                localStorage.setItem(
                    "paymentData",
                    JSON.stringify({
                        status: "SUCCESS",
                        method: method,
                        bookingId: booking.bookingId,
                        amount: booking.total,
                        paymentDate: new Date().toISOString()
                    })
                );


                // GO TO CONFIRMATION

                window.location.href = "confirmation.html";


            } catch (error) {

                console.error("Payment update failed:", error);

                alert("Could not update your booking. Please try again.");

                paymentProcessing = false;

                payButton.disabled = false;
                payButton.textContent = "PAY NOW";

                if (cancelButton) {
                    cancelButton.disabled = false;
                }

            }

        }, 1200);

    });

}
