// ✅ seller.js

let otpVerified = false;

// Send OTP
async function sendSellerOTP() {
  const email = document.getElementById("signupEmail").value.trim();

  if (!email) {
    alert("Please enter your email to receive OTP");
    return;
  }

  const button = event.target;
  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const res = await fetch("http://localhost:5000/api/sellers/send-otp-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      document.getElementById("otpVerifySection").classList.remove("hidden");
    }
  } catch (err) {
    alert("Failed to send OTP");
  }

  setTimeout(() => {
    button.disabled = false;
    button.textContent = "Send OTP";
  }, 10000);
}

// Verify OTP
async function verifySellerOTP() {
  const email = document.getElementById("signupEmail").value.trim();
  const otp = document.getElementById("signupOtp").value.trim();

  if (!email || !otp) {
    alert("Enter both email and OTP");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/sellers/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP Verified! You can now complete signup.");
      otpVerified = true;
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Failed to verify OTP");
  }
}

// Submit Signup
async function submitSellerSignup() {
  if (!otpVerified) {
    alert("Please verify OTP before signing up");
    return;
  }

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const vendorName = document.getElementById("signupVendorName").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !phone || !vendorName || !password) {
    alert("All fields are required.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/sellers/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, vendorName, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful!");
      showTab("login");
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Signup failed. Try again.");
  }
}

// Login Handler
let tempSellerLogin = null;
let loginOtpVerified = false;

async function handleSellerLogin() {
  const emailOrPhone = document.getElementById("loginEmailOrPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!emailOrPhone || !password) {
    alert("Please enter both fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/sellers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Temporarily store token & user until OTP is verified
      tempSellerLogin = data;
      document.getElementById("loginOtpSection").classList.remove("hidden");
      alert("Credentials verified. Please enter OTP sent to your email.");
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Login failed");
  }
}
async function sendLoginOTP() {
  const emailOrPhone = document.getElementById("loginEmailOrPhone").value.trim();
  if (!emailOrPhone) return alert("Enter email/phone first.");

  const button = event.target;
  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const res = await fetch("http://localhost:5000/api/sellers/send-otp-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailOrPhone })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    alert("OTP send failed");
  }

  setTimeout(() => {
    button.disabled = false;
    button.textContent = "Send OTP";
  }, 10000);
}
async function verifyLoginOTP() {
  const email = document.getElementById("loginEmailOrPhone").value.trim();
  const otp = document.getElementById("loginOtp").value.trim();

  if (!otp || !email) return alert("Enter OTP");

  try {
    const res = await fetch("http://localhost:5000/api/sellers/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP Verified. Login successful.");
      localStorage.setItem("sellerAuthToken", tempSellerLogin.token);
      window.location.href = "index.html"; // or dashboard
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("OTP verification failed");
  }
}
// ==============================
// ✅ Forgot Password Flow
// ==============================

let resetEmail = null;
let forgotOtpVerified = false;

// Step 1: Send OTP to email
async function sendForgotOtp() {
  const email = document.getElementById("forgotEmail").value.trim();
  if (!email) return alert("Enter your registered email");

  const button = event.target;
  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const res = await fetch("http://localhost:5000/api/sellers/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      resetEmail = email;
      document.getElementById("forgotOtpSection").classList.remove("hidden");
    }
  } catch (err) {
    alert("Failed to send OTP");
  }

  setTimeout(() => {
    button.disabled = false;
    button.textContent = "Send OTP";
  }, 10000);
}

// Step 2: Verify OTP
async function verifyForgotOtp() {
  const otp = document.getElementById("forgotOtp").value.trim();
  if (!resetEmail || !otp) return alert("Email and OTP required");

  try {
    const res = await fetch("http://localhost:5000/api/sellers/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, otp })
    });

    const data = await res.json();
    if (res.ok) {
      forgotOtpVerified = true;
      document.getElementById("resetPasswordSection").classList.remove("hidden");
      alert("OTP verified! You can now reset your password.");
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("OTP verification failed");
  }
}

// Step 3: Reset password
async function resetForgotPassword() {
  const newPassword = document.getElementById("forgotNewPassword").value.trim();
  if (!resetEmail || !forgotOtpVerified || !newPassword) {
    return alert("Please verify OTP and enter new password");
  }

  try {
    const res = await fetch("http://localhost:5000/api/sellers/forgot-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, newPassword })
    });

    const data = await res.json();
    if (res.ok) {
  alert("Password reset successful. You can now log in.");
  showTab("login");
  location.reload(); // ✅ Refresh the page to clear any temp states
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Password reset failed");
  }
}
