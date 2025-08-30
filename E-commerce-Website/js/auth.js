// User Management Functions
function getUsers() {
    return JSON.parse(localStorage.getItem('mstore_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('mstore_users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('mstore_current_user')) || null;
}

function setCurrentUser(user) {
    localStorage.setItem('mstore_current_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('mstore_current_user');
}

// Password validation
function validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

// Email validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Check if user exists
function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Register a new user
function registerUser(fullName, username, phone, email, password) {
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (userExists(email)) {
        alert('An account with this email already exists.');
        return false;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
        return false;
    }

    const users = getUsers();
    const newUser = {
        id: Date.now(),
        fullName,
        username,
        phone,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Clear any fake orders for new user
    clearFakeOrdersForNewUser();
    
    // Auto-login after registration
    setCurrentUser(newUser);

    // Reset signup form
    const signupForm = document.getElementById('signup-authForm');
    if (signupForm) {
        signupForm.reset();
    }

    alert('Account created successfully! Redirecting to dashboard...');
    window.location.href = 'user-dashboard.html';
    return true;
}

// Login user
function loginUser(email, password) {
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Invalid email or password.');
        return false;
    }

    // Clear any fake orders for returning user (optional - only if you want to clear for all logins)
    // clearFakeOrdersForNewUser();
    
    setCurrentUser(user);

    // Reset login form
    const loginForm = document.getElementById('authForm');
    if (loginForm) {
        loginForm.reset();
    }

    window.location.href = 'user-dashboard.html';
    return true;
}

// Logout user
function logoutUser() {
    clearCurrentUser();
    window.location.href = 'main.html';
}

// Clear fake/demo orders for new users
function clearFakeOrdersForNewUser() {
    // Clear any existing orders to ensure new users start with empty order history
    localStorage.removeItem('orders');
    localStorage.removeItem('notifications');
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Update the DOMContentLoaded event to handle form submissions
document.addEventListener('DOMContentLoaded', function () {
    // Login form submission
    const loginForm = document.getElementById('authForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            loginUser(email, password);
        });
    }

    // Signup form submission - FIXED SELECTOR
    const signupForm = document.getElementById('signup-authForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const fullName = this.querySelector('input[placeholder="Full Name"]').value;
            const username = this.querySelector('input[placeholder="Username"]').value;
            const phone = this.querySelector('input[placeholder="Phone Number"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[placeholder="Password"]').value;
            const confirmPassword = this.querySelector('input[placeholder="Confirm-Password"]').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            registerUser(fullName, username, phone, email, password);
        });
    }

    // Add logout functionality to the sidebar if we're on the dashboard
    const logoutLink = document.querySelector('a[href="#"] i.fa-sign-out-alt')?.closest('a');
    if (logoutLink && isLoggedIn()) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
        });
    }

    // Update dashboard with user info if logged in
    if (isLoggedIn() && window.location.pathname.includes('user-dashboard.html')) {
        const user = getCurrentUser();
        const userNameElements = document.querySelectorAll('.user-name, .welcome-text h2');

        userNameElements.forEach(el => {
            if (el.classList.contains('user-name')) {
                el.textContent = user.fullName || user.username;
            } else if (el.classList.contains('welcome-text')) {
                const h2 = el.querySelector('h2');
                if (h2) h2.textContent = `Welcome back, ${user.fullName || user.username}!`;
            }
        });

        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            const initials = (user.fullName || user.username).split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials;
        }
    } else if (!isLoggedIn() && window.location.pathname.includes('user-dashboard.html')) {
        // Redirect to main page if not logged in
        window.location.href = 'main.html';
    }
});

// Mobile login
document.addEventListener('DOMContentLoaded', function() {
    const mobileLogin = document.getElementById('loginBtnMobile');
    if (mobileLogin) {
        mobileLogin.addEventListener('click', function () {
            document.querySelector('.modal').style.display = 'flex';
            document.body.classList.add('modal-open');
        });
    }
    
    // Mobile signup
    const mobileSignup = document.getElementById('signupBtnMobile');
    if (mobileSignup) {
        mobileSignup.addEventListener('click', function () {
            document.querySelector('.signup-modal').style.display = 'flex';
            document.body.classList.add('modal-open');
        });
    }
});

// Close Auth Modal
document.querySelector('.close')?.addEventListener('click', function () {
    document.querySelector('.modal').style.display = 'none';
    document.body.classList.remove('modal-open');
    // Reset login form
    const loginForm = document.getElementById('authForm');
    if (loginForm) {
        loginForm.reset();
    }
});

// Close Signup Modal
document.querySelector('.signup-close')?.addEventListener('click', function () {
    document.querySelector('.signup-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
    // Reset signup form
    const signupForm = document.getElementById('signup-authForm');
    if (signupForm) {
        signupForm.reset();
    }
});

// Switch between Login and Signup
document.getElementById('switchToSignup')?.addEventListener('click', function (e) {
    e.preventDefault();
    // Reset login form before switching
    const loginForm = document.getElementById('authForm');
    if (loginForm) {
        loginForm.reset();
    }
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.signup-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
});

document.getElementById('switchToLogin')?.addEventListener('click', function (e) {
    e.preventDefault();
    // Reset signup form before switching
    const signupForm = document.getElementById('signup-authForm');
    if (signupForm) {
        signupForm.reset();
    }
    document.querySelector('.signup-modal').style.display = 'none';
    document.querySelector('.modal').style.display = 'flex';
    document.body.classList.add('modal-open');
});

// Hero btn
document.getElementById('herobtn')?.addEventListener('click', function () {
    document.querySelector('.modal').style.display = 'flex';
});

// Desktop login
document.getElementById('loginBtn')?.addEventListener('click', function () {
    document.querySelector('.modal').style.display = 'flex';
    document.body.classList.add('modal-open');
});

// Desktop signup
document.getElementById('signupBtn')?.addEventListener('click', function () {
    document.querySelector('.signup-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
});

// Luxury btn - redirect to dashboard if logged in
document.getElementById('luxury-btn')?.addEventListener('click', function (e) {
    e.preventDefault();
    if (isLoggedIn()) {
        window.location.href = 'user-dashboard.html';
    } else {
        document.querySelector('.modal').style.display = 'flex';
        document.body.classList.add('modal-open');
    }
});

// Function to open login modal from collection buttons
function openLoginModal(redirectUrl) {
    const loginModal = document.querySelector('.modal');
    if (loginModal) {
        loginModal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
}

// Debug function to check if users are being saved
function debugCheckUsers() {
    console.log("Current users in localStorage:", getUsers());
}

// Call this to check if users are being saved
debugCheckUsers();

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    // Login modal
    const loginModal = document.querySelector('.modal');
    if (loginModal) {
        loginModal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.classList.remove('modal-open');
                // Reset login form
                const loginForm = document.getElementById('authForm');
                if (loginForm) {
                    loginForm.reset();
                }
            }
        });
    }

    // Signup modal
    const signupModal = document.querySelector('.signup-modal');
    if (signupModal) {
        signupModal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.classList.remove('modal-open');
                // Reset signup form
                const signupForm = document.getElementById('signup-authForm');
                if (signupForm) {
                    signupForm.reset();
                }
            }
        });
    }
});
// for logout in the user dashboard 
document.getElementById('user-logout').addEventListener('click', function (e) {
    e.preventDefault();
    logoutUser();
});