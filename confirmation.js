 
// ======================================
// LARPTIX - DIGITAL TICKET
// ======================================

function initializeTicket() {

    // GET CURRENT LOGGED-IN USER
    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );
    } catch (error) {
        currentUser = null;
    }

    // CHECK LOGIN
    if (!currentUser || !currentUser.identifier) {
        window.location.replace("login.html");
        return;
    }

    // GET BOOKINGS
    let bookings = [];

    try {
        bookings = JSON.parse(
            localStorage.getItem("myBookings")
        ) || [];

        if (!Array.isArray(bookings)) {
            bookings = [];
        }

    } catch (error) {
        bookings = [];
    }

    // GET EXACT SELECTED BOOKING
    const savedIndex = localStorage.getItem(
        "selectedBookingIndex"
    );

    let booking = null;

    if (savedIndex !== null) {

        const index = Number(savedIndex);

        if (Number.isInteger(index) && index >= 0) {
            booking = bookings[index] || null;
        }
    }

    const page = document.querySelector(
        ".confirmation-page"
    );

    if (!page) {
        console.error("Confirmation page element not found.");
        return;
    }

    // CHECK BOOKING
    if (!booking) {

        page.innerHTML = `
            <div class="success-message">
                <h1>NO BOOKING FOUND</h1>
                <p>Please book a movie first.</p>
                <a href="index.html">BACK TO HOME</a>
            </div>
        `;

        return;
    }

    // CHECK BOOKING OWNERSHIP
    if (
        booking.customerIdentifier !== currentUser.identifier
    ) {

        page.innerHTML = `
            <div class="success-message">
                <h1>ACCESS DENIED</h1>
                <p>This ticket does not belong to your account.</p>
                <a href="my-bookings.html">GO TO MY BOOKINGS</a>
            </div>
        `;

        return;
    }

    // CHECK PAYMENT STATUS
    if (booking.paymentStatus !== "PAID") {

        page.innerHTML = `
            <div class="success-message">
                <h1>PAYMENT PENDING</h1>
                <p>Your booking has not been confirmed yet.</p>
                <p>Please complete your payment to receive your ticket.</p>
                <a href="payment.html">COMPLETE PAYMENT</a>
                <br><br>
                <a href="my-bookings.html">MY BOOKINGS</a>
            </div>
        `;

        return;
    }

    // GET MOVIE DETAILS SAFELY
    let movie = null;

    try {
        movie = JSON.parse(
            localStorage.getItem("selectedMovie")
        );
    } catch (error) {
        movie = null;
    }

    // MOVIE NAME
    document.getElementById("ticket-movie-name").textContent =
        booking.movie || "Movie";

    // GENRE
    document.getElementById("ticket-genre").textContent =
        booking.genre ||
        (movie && movie.name === booking.movie
            ? movie.genre
            : "Movie Experience");

    // MOVIE POSTER
    const poster = document.getElementById("ticket-poster");

    const posterImage =
        booking.image ||
        (movie && movie.name === booking.movie
            ? movie.image
            : "");

    if (poster) {

        if (posterImage) {
            poster.src = posterImage;
            poster.style.display = "";
        } else {
            poster.style.display = "none";
        }

    }

    // DATE
    const date = new Date(
        booking.date + "T00:00:00"
    );

    document.getElementById("ticket-date").textContent =
        !isNaN(date.getTime())
            ? date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            : booking.date || "-";

    // SHOWTIME
    document.getElementById("ticket-time").textContent =
        booking.time || "-";

    // SCREEN
    document.getElementById("ticket-screen").textContent =
        booking.screen
            ? booking.screen + " SCREEN"
            : "STANDARD SCREEN";

    // SEATS
    document.getElementById("ticket-seats").textContent =
        Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : booking.seats || "-";

    // PRICE PER SEAT
    document.getElementById("ticket-price").textContent =
        "₹" + (booking.ticketPrice ?? 0);

    // TOTAL PAID
    document.getElementById("ticket-total").textContent =
        "₹" + (booking.total ?? 0);

    // BOOKING ID
    document.getElementById("ticket-id").textContent =
        booking.bookingId || "-";

}

// INITIALIZE TICKET
initializeTicket();
