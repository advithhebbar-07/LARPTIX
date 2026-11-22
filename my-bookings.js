 
// ======================================
// LARPTIX - MY BOOKINGS
// ======================================

// CHECK LOGGED-IN USER
let currentUser = null;

try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
} catch (error) {
    currentUser = null;
}

// PROTECT MY BOOKINGS PAGE
if (!currentUser || !currentUser.identifier) {
    window.location.replace("login.html");
}

// GET HTML ELEMENTS
const bookingList = document.getElementById("booking-list");
const emptyBookings = document.getElementById("empty-bookings");
const bookingCount = document.getElementById("booking-count");

// GET BOOKINGS FROM LOCAL STORAGE
function getBookings() {
    try {
        const savedBookings = JSON.parse(
            localStorage.getItem("myBookings")
        );

        return Array.isArray(savedBookings) ? savedBookings : [];

    } catch (error) {
        console.error("Could not load bookings:", error);
        return [];
    }
}

// FILTER BOOKINGS FOR CURRENT USER
const allBookings = getBookings();

let bookings = allBookings
    .map(function (booking, originalIndex) {
        return {
            booking: booking,
            originalIndex: originalIndex
        };
    })
    .filter(function (item) {
        return item.booking.customerIdentifier === currentUser.identifier;
    });

// FORMAT DATE
function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date + "T00:00:00");

    if (isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// DISPLAY BOOKINGS
function displayBookings() {

    if (!bookingList || !emptyBookings || !bookingCount) {
        console.error("My Bookings HTML elements are missing!");
        return;
    }

    bookingList.innerHTML = "";

    bookingCount.textContent =
        bookings.length +
        (bookings.length === 1 ? " BOOKING" : " BOOKINGS");

    // EMPTY STATE
    if (bookings.length === 0) {
        emptyBookings.classList.remove("hidden");
        return;
    }

    emptyBookings.classList.add("hidden");

    // LATEST BOOKING FIRST
    const sortedBookings = [...bookings].reverse();

    // CREATE BOOKING CARDS
    sortedBookings.forEach(function (item) {

        const booking = item.booking;
        const originalIndex = item.originalIndex;

        const status = (
            booking.paymentStatus || "PENDING"
        ).toUpperCase();

        const isPaid = status === "PAID";

        const statusClass = isPaid ? "paid" : "pending";

        const seats = Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : booking.seats || "Not selected";

        const screen = booking.screen || "Standard";

        const ticketPrice = Number(booking.ticketPrice) || 0;
        const total = Number(booking.total) || 0;

        // CREATE CARD
        const card = document.createElement("div");
        card.className = "booking-card";

        card.innerHTML = `
            <div class="card-top">
                <h2 class="movie-name"></h2>
                <span class="booking-status ${statusClass}"></span>
            </div>

            <p class="movie-genre"></p>

            <div class="booking-details">
                <div>
                    <p class="detail-label">DATE</p>
                    <p class="detail-value date-value"></p>
                </div>

                <div>
                    <p class="detail-label">SHOWTIME</p>
                    <p class="detail-value time-value"></p>
                </div>

                <div>
                    <p class="detail-label">SCREEN</p>
                    <p class="detail-value screen-value"></p>
                </div>

                <div>
                    <p class="detail-label">SEATS</p>
                    <p class="detail-value seats-value"></p>
                </div>

                <div>
                    <p class="detail-label">PRICE / SEAT</p>
                    <p class="detail-value price-value"></p>
                </div>
            </div>

            <p class="card-total"></p>

            <div class="booking-bottom">
                <p class="booking-id"></p>
                <button class="ticket-btn" type="button"></button>
            </div>
        `;

        // INSERT BOOKING DETAILS
        card.querySelector(".movie-name").textContent =
            booking.movie || "Movie";

        card.querySelector(".booking-status").textContent =
            status;

        card.querySelector(".movie-genre").textContent =
            booking.genre || "LARPTIX CINEMA EXPERIENCE";

        card.querySelector(".date-value").textContent =
            formatDate(booking.date);

        card.querySelector(".time-value").textContent =
            booking.time || "Not available";

        card.querySelector(".screen-value").textContent =
            screen + " SCREEN";

        card.querySelector(".seats-value").textContent =
            seats;

        card.querySelector(".price-value").textContent =
            "₹" + ticketPrice;

        card.querySelector(".card-total").textContent =
            "TOTAL: ₹" + total;

        card.querySelector(".booking-id").textContent =
            "BOOKING ID: " + (booking.bookingId || "N/A");

        // BUTTON
        const button = card.querySelector(".ticket-btn");

        button.textContent = isPaid
            ? "VIEW TICKET"
            : "PAY NOW";

        // BUTTON ACTION
        button.addEventListener("click", function () {

            localStorage.setItem(
                "selectedBookingIndex",
                String(originalIndex)
            );

            if (isPaid) {
                window.location.href = "confirmation.html";
            } else {
                window.location.href = "payment.html";
            }

        });

        // ADD CARD
        bookingList.appendChild(card);

    });
}

// INITIALIZE
if (currentUser && currentUser.identifier) {
    displayBookings();
}
