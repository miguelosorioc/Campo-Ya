//const API = 'http://127.0.0.1:8000/api';
const API = 'https://campo-ya-production.up.railway.app/api';

document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('roleInput').value = btn.dataset.role;
    });
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorMsg   = document.getElementById('registerError');
    const successMsg = document.getElementById('registerSuccess');
    const btn        = e.target.querySelector('button[type="submit"]');
    errorMsg.textContent   = '';
    successMsg.textContent = '';

    const username = e.target.username.value.trim();
    const email    = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm  = e.target.confirmPassword.value;
    const rol      = document.getElementById('roleInput').value;

    if (password !== confirm) {
        errorMsg.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    if (!rol) {
        errorMsg.textContent = 'Selecciona un rol: Cliente o Granjero.';
        return;
    }

    btn.textContent = 'Creando cuenta...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API}/users/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, rol })
        });

        const data = await res.json();

        if (res.ok) {
            successMsg.textContent = '¡Cuenta creada! Redirigiendo...';
            setTimeout(() => window.location.href = 'sesion.html', 1500);
        } else {
            const errores = Object.values(data).flat().join(' ');
            errorMsg.textContent = errores;
            btn.textContent = 'Crear cuenta';
            btn.disabled = false;
        }
    } catch (err) {
        errorMsg.textContent = 'Error de conexión con el servidor.';
        btn.textContent = 'Crear cuenta';
        btn.disabled = false;
    }
});