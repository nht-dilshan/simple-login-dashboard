// Hardcoded credentials for demonstration
const HARDCODED_USERS = [
    {
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com'
    },
    {
        username: 'user',
        password: 'user123',
        email: 'user@example.com'
    },
    {
        username: 'demo',
        password: 'demo123',
        email: 'demo@example.com'
    }
];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'login.html';
    
    switch(currentPage) {
        case 'login.html':
        case '':
            initializeLoginPage();
            break;
        case 'signup.html':
            initializeSignupPage();
            break;
        case 'dashboard.html':
            initializeDashboardPage();
            break;
    }
}

// Login page functionality
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');
    
    // Clear previous error messages
    errorMessage.textContent = '';
    
    // Validate input
    if (!username || !password) {
        showError('Please enter both username and password.', 'error-message');
        return;
    }
    
    // Check against hardcoded users
    const user = HARDCODED_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store user session
        const sessionData = {
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString(),
            loginCount: getLoginCount(user.username) + 1
        };
        
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Store login count
        setLoginCount(user.username, sessionData.loginCount);
        
        // Show success message and redirect
        showSuccess('Login successful! Redirecting to dashboard...', 'error-message');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showError('Invalid username or password. Try: admin/admin123, user/user123, or demo/demo123', 'error-message');
    }
}

// Signup page functionality
function initializeSignupPage() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
    
    // Check if user is already logged in
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}

function handleSignup() {
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMessage = document.getElementById('signup-error-message');
    const successMessage = document.getElementById('signup-success-message');
    
    // Clear previous messages
    errorMessage.textContent = '';
    successMessage.textContent = '';
    
    // Validate input
    if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields.', 'signup-error-message');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match.', 'signup-error-message');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long.', 'signup-error-message');
        return;
    }
    
    // Check if username already exists
    const existingUser = HARDCODED_USERS.find(u => u.username === username);
    if (existingUser) {
        showError('Username already exists. Please choose a different username.', 'signup-error-message');
        return;
    }
    
    // Check if email already exists
    const existingEmail = HARDCODED_USERS.find(u => u.email === email);
    if (existingEmail) {
        showError('Email already exists. Please use a different email.', 'signup-error-message');
        return;
    }
    
    // Add new user to hardcoded users (for this session only)
    const newUser = {
        username: username,
        email: email,
        password: password
    };
    HARDCODED_USERS.push(newUser);
    
    // Store user registration data
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({
        username: username,
        email: email,
        registrationDate: new Date().toISOString()
    });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    showSuccess('Account created successfully! You can now login with your credentials.', 'signup-success-message');
    
    // Clear form
    document.getElementById('signupForm').reset();
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Dashboard page functionality
function initializeDashboardPage() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    loadDashboardData();
}

function loadDashboardData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
    }
    
    // Update user display information
    const userDisplayName = document.getElementById('userDisplayName');
    const userDisplayEmail = document.getElementById('userDisplayEmail');
    const lastLogin = document.getElementById('lastLogin');
    const loginCount = document.getElementById('loginCount');
    const accountCreated = document.getElementById('accountCreated');
    
    if (userDisplayName) userDisplayName.textContent = currentUser.username;
    if (userDisplayEmail) userDisplayEmail.textContent = currentUser.email;
    if (lastLogin) lastLogin.textContent = formatDateTime(currentUser.loginTime);
    if (loginCount) loginCount.textContent = currentUser.loginCount || 1;
    
    // Get account creation date
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userRegistration = registeredUsers.find(u => u.username === currentUser.username);
    if (accountCreated) {
        if (userRegistration) {
            accountCreated.textContent = formatDate(userRegistration.registrationDate);
        } else {
            accountCreated.textContent = 'N/A (Hardcoded User)';
        }
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        // Show logout message
        alert('You have been logged out successfully!');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Utility functions
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function getLoginCount(username) {
    const loginCounts = JSON.parse(localStorage.getItem('loginCounts') || '{}');
    return loginCounts[username] || 0;
}

function setLoginCount(username, count) {
    const loginCounts = JSON.parse(localStorage.getItem('loginCounts') || '{}');
    loginCounts[username] = count;
    localStorage.setItem('loginCounts', JSON.stringify(loginCounts));
}

function showError(message, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'error-message';
    }
}

function showSuccess(message, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'success-message';
    }
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function showAlert(message) {
    alert(message);
}

// Session timeout functionality (optional)
function checkSessionTimeout() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const loginTime = new Date(currentUser.loginTime);
        const now = new Date();
        const timeDiff = now - loginTime;
        
        // Auto logout after 1 hour (3600000 ms)
        if (timeDiff > 3600000) {
            alert('Your session has expired. Please login again.');
            handleLogout();
        }
    }
}

// Check session timeout every 5 minutes
setInterval(checkSessionTimeout, 300000);

// Display available hardcoded credentials in console for easy reference
console.log('Available hardcoded credentials:');
console.log('1. Username: admin, Password: admin123');
console.log('2. Username: user, Password: user123');
console.log('3. Username: demo, Password: demo123');