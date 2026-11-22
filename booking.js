 
// ======================================
// LARPTIX - DYNAMIC MULTIPLEX BOOKING
// ======================================

// CHECK LOGGED-IN USER
let currentUser = null;

try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
} catch (error) {
    currentUser = null;
}

// PROTECT BOOKING PAGE
if (!currentUser || !currentUser.identifier) {
    window.location.replace("login.html");
}

// GET SELECTED MOVIE
let selectedMovie = null;

try {
    selectedMovie = JSON.parse(localStorage.getItem("selectedMovie"));
} catch (error) {
    selectedMovie = null;
}

const movieName = document.getElementById("booking-movie");
const movieGenre = document.getElementById("booking-genre");

if (selectedMovie) {
    movieName.textContent = selectedMovie.name || "Selected Movie";
    movieGenre.textContent = selectedMovie.genre || "Movie Experience";
} else {
    movieName.textContent = "No movie selected";
    movieGenre.textContent = "Go back and select a movie.";
}

// GET HTML ELEMENTS
const dateInput = document.getElementById("booking-date");
const timeButtons = document.querySelectorAll(".time-btn");
const screenButtons = document.querySelectorAll(".screen-option");
const seatLayout = document.getElementById("seat-layout");

const summaryMovie = document.getElementById("summary-movie");
const summaryDate = document.getElementById("summary-date");
const summaryTime = document.getElementById("summary-time");
const summaryScreen = document.getElementById("summary-screen");
const summarySeats = document.getElementById("summary-seats");
const summaryPrice = document.getElementById("summary-price");
const totalPrice = document.getElementById("total-price");

const screenLabel = document.getElementById("screen-label");
const screenDescription = document.getElementById("screen-description");
const confirmButton = document.getElementById("confirm-booking");

// SCREEN DETAILS
const screens = {
    standard: {
        name: "Standard",
        label: "STANDARD SCREEN",
        price: 180,
        rows: 6,
        columns: 8,
        occupied: ["A3", "A4", "B6", "C2", "D7", "E5", "F1"]
    },

    premium: {
        name: "Premium",
        label: "PREMIUM SCREEN",
        price: 250,
        rows: 8,
        columns: 10,
        occupied: ["A3", "A4", "B6", "C2", "D7", "E5", "F1", "G4", "H8"]
    },

    imax: {
        name: "IMAX",
        label: "IMAX SCREEN",
        price: 350,
        rows: 10,
        columns: 12,
        occupied: [
            "A3", "A4", "B6", "C2", "D7",
            "E5", "F1", "G4", "H8", "I6", "J9"
        ]
    }
};

// BOOKING VARIABLES
let selectedScreen = "standard";
let selectedTime = "";
let selectedSeats = [];

// SET MINIMUM DATE
const today = new Date();

const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;
dateInput.value = localToday;

// INITIAL SUMMARY
summaryMovie.textContent = selectedMovie
    ? selectedMovie.name
    : "Not selected";

summaryDate.textContent = dateInput.value;

// DATE SELECTION
dateInput.addEventListener("change", function () {
    summaryDate.textContent = this.value || "-";
});

// SHOWTIME SELECTION
timeButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        timeButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        selectedTime = this.dataset.time;

        summaryTime.textContent = selectedTime;
    });
});

// SCREEN SELECTION
screenButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        screenButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        selectedScreen = this.dataset.screen;

        selectedSeats = [];

        createSeats();
        updateSummary();
    });
});

// CREATE SEATS
function createSeats() {

    const screen = screens[selectedScreen];

    seatLayout.innerHTML = "";

    seatLayout.style.gridTemplateColumns =
        `repeat(${screen.columns}, 34px)`;

    screenLabel.textContent = screen.label;

    screenDescription.textContent =
        `${screen.name.toUpperCase()} AUDITORIUM · ${screen.rows * screen.columns} SEATS`;

    const rowNames = "ABCDEFGHIJ".split("");

    for (let row = 0; row < screen.rows; row++) {

        for (let number = 1; number <= screen.columns; number++) {

            const seatNumber = rowNames[row] + number;

            const seat = document.createElement("button");

            seat.type = "button";
            seat.className = "seat";
            seat.textContent = seatNumber;

            if (screen.occupied.includes(seatNumber)) {

                seat.classList.add("occupied");
                seat.disabled = true;

            } else {

                seat.classList.add("available");

                seat.addEventListener("click", function () {

                    if (selectedSeats.includes(seatNumber)) {

                        selectedSeats = selectedSeats.filter(
                            item => item !== seatNumber
                        );

                        seat.classList.remove("selected");
                        seat.classList.add("available");

                    } else {

                        selectedSeats.push(seatNumber);

                        seat.classList.remove("available");
                        seat.classList.add("selected");

                    }

                    updateSummary();

                });

            }

            seatLayout.appendChild(seat);

        }

    }

}

// UPDATE SUMMARY
function updateSummary() {

    const screen = screens[selectedScreen];

    summaryScreen.textContent = screen.name;

    summaryPrice.textContent = screen.price;

    summarySeats.textContent = selectedSeats.length
        ? selectedSeats.join(", ")
        : "None";

    totalPrice.textContent =
        selectedSeats.length * screen.price;

}

// CONFIRM BOOKING
confirmButton.addEventListener("click", function () {

    // CHECK LOGIN AGAIN
    if (!currentUser || !currentUser.identifier) {
        alert("Please login before booking!");
        window.location.href = "login.html";
        return;
    }

    if (!selectedMovie) {
        alert("Please select a movie first!");
        return;
    }

    if (!dateInput.value) {
        alert("Please select a date!");
        return;
    }

    if (!selectedTime) {
        alert("Please select a showtime!");
        return;
    }

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat!");
        return;
    }

    const screen = screens[selectedScreen];

    // CREATE BOOKING
    const booking = {

        bookingId: "LARP" + Date.now(),

        // IDENTIFY BOOKING OWNER
        customerIdentifier: currentUser.identifier,

        movie: selectedMovie.name,
        genre: selectedMovie.genre || "Movie Experience",
        image: selectedMovie.image || "",

        date: dateInput.value,
        time: selectedTime,

        screen: screen.name,
        screenType: selectedScreen,

        seats: [...selectedSeats],

        ticketPrice: screen.price,

        total: selectedSeats.length * screen.price,

        paymentStatus: "PENDING"

    };

    // LOAD EXISTING BOOKINGS
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

    // SAVE NEW BOOKING
    bookings.push(booking);

    try {

        localStorage.setItem(
            "myBookings",
            JSON.stringify(bookings)
        );

        // VERIFY SAVED BOOKING
        const savedBookings = JSON.parse(
            localStorage.getItem("myBookings")
        );

        if (
            !Array.isArray(savedBookings) ||
            !savedBookings.some(
                item => item.bookingId === booking.bookingId
            )
        ) {
            throw new Error("Booking could not be verified.");
        }

        // SAVE ORIGINAL BOOKING INDEX
        localStorage.setItem(
            "selectedBookingIndex",
            String(bookings.length - 1)
        );

        // GO TO PAYMENT
        window.location.href = "payment.html";

    } catch (error) {

        console.error("Booking save failed:", error);

        alert(
            "Could not save your booking. Please check browser storage."
        );

    }

});

// INITIALIZE
createSeats();
updateSummary();
