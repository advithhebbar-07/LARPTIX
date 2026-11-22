 
// ======================================
// LARPTIX - LOGIN & SIGNUP SYSTEM
// ======================================

// GET ELEMENTS

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");


// ======================================
// SHOW / HIDE PASSWORD
// ======================================

const passwordToggles = document.querySelectorAll(".toggle-password");

passwordToggles.forEach(function(button) {

    button.addEventListener("click", function() {

        const targetId = this.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (!passwordInput) return;

        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";

        this.textContent = isHidden ? "HIDE" : "SHOW";

        this.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        this.setAttribute("aria-pressed", String(isHidden));

    });

});


// ======================================
// SWITCH LOGIN AND SIGNUP
// ======================================

function showLogin() {

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

}

function showSignup() {

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);


// ======================================
// IDENTIFIER VALIDATION
// EMAIL OR MOBILE NUMBER
// ======================================

function getIdentifierType(value) {

    const identifier = value.trim().toLowerCase();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const isPhone = /^[6-9]\d{9}$/.test(identifier);

    if (isEmail) return "email";

    if (isPhone) return "phone";

    return null;

}


// ======================================
// CREATE NEW ACCOUNT
// ======================================

signupForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("signup-name").value.trim();

    const identifier = document.getElementById("signup-identifier")
        .value.trim().toLowerCase();

    const password = document.getElementById("signup-password").value;

    const confirmPassword = document.getElementById("confirm-password").value;

    if (!name || !identifier || !password || !confirmPassword) {
        alert("Please fill in all fields!");
        return;
    }

    const identifierType = getIdentifierType(identifier);

    if (!identifierType) {
        alert("Enter a valid email or 10-digit mobile number!");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // GET EXISTING USERS

    let users = [];

    try {
        users = JSON.parse(localStorage.getItem("larptixUsers")) || [];
    } catch (error) {
        users = [];
    }

    // CHECK DUPLICATE ACCOUNT

    const existingUser = users.find(user => {

        const oldIdentifier = (
            user.identifier ||
            user.email ||
            user.phone ||
            ""
        ).toLowerCase();

        return oldIdentifier === identifier;

    });

    if (existingUser) {
        alert("Account already exists! Please login.");
        showLogin();
        return;
    }

    // CREATE ACCOUNT

    const newUser = {
        name: name,
        identifier: identifier,
        identifierType: identifierType,
        password: password
    };

    users.push(newUser);

    localStorage.setItem("larptixUsers", JSON.stringify(users));

    alert("Account created successfully! Welcome to LARPTIX.");

    signupForm.reset();

    // RESET PASSWORD VISIBILITY

    passwordToggles.forEach(function(button) {

        const input = document.getElementById(button.dataset.target);

        if (input) input.type = "password";

        button.textContent = "SHOW";

        button.setAttribute("aria-pressed", "false");

        button.setAttribute("aria-label", "Show password");

    });

    showLogin();

});


// ======================================
// LOGIN WITH EMAIL OR MOBILE NUMBER
// ======================================

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const identifier = document.getElementById("login-identifier")
        .value.trim().toLowerCase();

    const password = document.getElementById("login-password").value;

    if (!identifier || !password) {
        alert("Please enter your email/mobile number and password!");
        return;
    }

    let users = [];

    try {
        users = JSON.parse(localStorage.getItem("larptixUsers")) || [];
    } catch (error) {
        users = [];
    }

    // FIND USER

    const user = users.find(item => {

        const savedIdentifier = (
            item.identifier ||
            item.email ||
            item.phone ||
            ""
        ).toLowerCase();

        return savedIdentifier === identifier &&
               item.password === password;

    });

    if (!user) {
        alert("Invalid email/mobile number or password!");
        return;
    }

    // SAVE LOGIN SESSION

    localStorage.setItem(
        "currentUser",
        JSON.stringify({
            name: user.name,
            identifier: user.identifier || user.email || user.phone,
            identifierType: user.identifierType || "email"
        })
    );

    // REDIRECT TO HOMEPAGE

    window.location.href = "index.html";

});


// ======================================
// GOOGLE LOGIN DEMO
// ======================================

document.getElementById("google-login").addEventListener("click", function() {

    alert("Google login integration coming soon!");

});


// ======================================
// APPLE LOGIN DEMO
// ======================================

document.getElementById("apple-login").addEventListener("click", function() {

    alert("Apple login integration coming soon!");

});


// ======================================
// SIMULATED MOBILE OTP LOGIN
// ======================================

let generatedOTP = "";

const phoneLogin = document.getElementById("phone-login");

const phoneSection = document.getElementById("phone-section");

const otpSection = document.getElementById("otp-section");


// SHOW PHONE SECTION

phoneLogin.addEventListener("click", function() {

    phoneSection.classList.toggle("hidden");

});


// ======================================
// GENERATE OTP
// ======================================

document.getElementById("send-otp").addEventListener("click", function() {

    const phone = document.getElementById("phone-number").value.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
        alert("Enter a valid 10-digit Indian mobile number!");
        return;
    }

    generatedOTP = String(
        Math.floor(100000 + Math.random() * 900000)
    );

    otpSection.classList.remove("hidden");

    document.getElementById("demo-otp").textContent =
        "DEMO OTP: " + generatedOTP;

    alert("Demo OTP generated successfully!");

});


// ======================================
// VERIFY OTP
// ======================================

document.getElementById("verify-otp").addEventListener("click", function() {

    const enteredOTP = document.getElementById("otp-input").value.trim();

    const phone = document.getElementById("phone-number").value.trim();

    if (!generatedOTP || enteredOTP !== generatedOTP) {
        alert("Incorrect OTP! Please try again.");
        return;
    }

    // SAVE LOGIN SESSION

    localStorage.setItem(
        "currentUser",
        JSON.stringify({
            name: "LARPTIX User",
            identifier: phone,
            identifierType: "phone",
            loginMethod: "Mobile OTP"
        })
    );

    // REDIRECT TO HOMEPAGE

    window.location.href = "index.html";

});
