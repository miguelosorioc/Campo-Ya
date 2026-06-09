const API = 'http://127.0.0.1:8000/api';

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const errorMsg = document.getElementById('loginError');
    const btn      = e.target.querySelector('button[type="submit"]');
    errorMsg.textContent = '';
    btn.textContent = 'Iniciando...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API}/users/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('access',   data.access);
            localStorage.setItem('refresh',  data.refresh);
            localStorage.setItem('username', username);
            window.location.href = 'producto.html';
        } else {
            errorMsg.textContent = 'Usuario o contraseña incorrectos.';
            btn.textContent = 'Iniciar sesión';
            btn.disabled = false;
        }
    } catch (err) {
        errorMsg.textContent = 'Error de conexión con el servidor.';
        btn.textContent = 'Iniciar sesión';
        btn.disabled = false;
    }
});