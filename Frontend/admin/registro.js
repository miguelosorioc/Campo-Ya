const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');
const roleInput = document.getElementById('roleInput');
const roleBtns = document.querySelectorAll('.role-btn');

// Manejar selección de rol
roleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        roleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        roleInput.value = this.getAttribute('data-role');
    });
});

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const fullname = formData.get('fullname').trim();
    const username = formData.get('username').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const confirmPassword = formData.get('confirmPassword').trim();
    const role = roleInput.value;

    // Limpiar mensajes anteriores
    registerError.textContent = '';
    registerSuccess.textContent = '';

    // Validaciones
    if (!fullname || !username || !email || !password || !confirmPassword || !role) {
        registerError.textContent = 'Por favor completa todos los campos y selecciona un rol.';
        return;
    }

    if (password.length < 6) {
        registerError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }

    if (password !== confirmPassword) {
        registerError.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('campoYaUsers') || '[]');
    const userExists = users.some(user => user.username === username || user.email === email);

    if (userExists) {
        registerError.textContent = 'El usuario o email ya está registrado.';
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        fullname,
        username,
        email,
        password, // En producción, nunca almacenes contraseñas en texto plano
        role,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('campoYaUsers', JSON.stringify(users));

    registerSuccess.textContent = '¡Cuenta creada exitosamente! Redirigiendo a inicio de sesión...';
    registerForm.reset();

    // Redirigir a login después de 2 segundos
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 2000);
});
