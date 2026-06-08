const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '1234';
const loginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');
const loginPanel = document.getElementById('loginPanel');
const adminPanel = document.getElementById('adminPanel');
const logoutButton = document.getElementById('logoutButton');

function showAdmin() {
    loginPanel.hidden = true;
    adminPanel.hidden = false;
}

function showLogin() {
    loginPanel.hidden = false;
    adminPanel.hidden = true;
    loginError.textContent = '';
    loginForm.reset();
}

function isLoggedIn() {
    return localStorage.getItem('campoYaAdmin') === 'true';
}

if (isLoggedIn()) {
    showAdmin();
}

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();

    // Verificar contra admin default
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
        localStorage.setItem('campoYaAdmin', 'true');
        showAdmin();
        return;
    }

    // Verificar contra usuarios registrados
    const users = JSON.parse(localStorage.getItem('campoYaUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('campoYaAdmin', 'true');
        showAdmin();
    } else {
        loginError.textContent = 'Usuario o contraseña incorrectos.';
    }
});

logoutButton.addEventListener('click', function () {
    localStorage.removeItem('campoYaAdmin');
    showLogin();
});