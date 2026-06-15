//const API = 'http://127.0.0.1:8000/api';
const API = 'https://campo-ya-production.up.railway.app/api';

let todosLosProductos = [];

// ── Contador del carrito en el header ──────────────────────────
function actualizarContadorCarrito() {
    const carrito  = JSON.parse(localStorage.getItem('carrito') || '[]');
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = carrito.length;
}

// ── Tiempo restante ────────────────────────────────────────────
function tiempoRestante(expira_en) {
    const ahora  = new Date();
    const expira = new Date(expira_en);
    const diff   = expira - ahora;

    if (diff <= 0) return '⏱ Expirado';

    const horas   = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (horas > 0) return `⏱ ${horas}h ${minutos}m`;
    return `⏱ ${minutos} min`;
}

// ── Cargar productos desde la API ──────────────────────────────
async function cargarProductos() {
    const contenedor = document.getElementById('products-container');
    if (!contenedor) return;

    try {
        const res  = await fetch(`${API}/productos/`);
        const data = await res.json();
        todosLosProductos = data;
        renderProductos(data);
    } catch (err) {
        contenedor.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#b3261e;padding:40px 0;">Error cargando productos. Verifica que el servidor esté activo.</p>';
    }
}

// ── Renderizar lista de productos ──────────────────────────────
function renderProductos(productos) {
    const contenedor = document.getElementById('products-container');

    if (productos.length === 0) {
        contenedor.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#5f6b55;padding:40px 0;">No hay productos disponibles hoy. Vuelve pronto 🌿</p>';
        return;
    }

    contenedor.innerHTML = productos.map(p => `
        <article class="card">
            <div class="image" style="${p.foto ? `background-image:url('http://127.0.0.1:8000${p.foto}');background-size:cover;background-position:center` : 'font-size:64px;'}">
                <span class="timer-badge">${tiempoRestante(p.expira_en)}</span>
            </div>
            <div class="card-content">
                <h3>${p.nombre}</h3>
                <strong>$${Number(p.precio).toLocaleString('es-CO')} / lb</strong>
                <p>${p.granjero}</p>
                <div class="card-footer">
                    <span>${p.stock > 0 ? 'Disponible' : 'Agotado'}</span>
                    <button
                        onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio},'${p.granjero}','${p.whatsapp}')"
                        ${p.stock <= 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    // Actualizar contadores cada minuto sin recargar toda la página
    setTimeout(() => renderProductos(todosLosProductos), 60000);
}

// ── Emoji según categoría ──────────────────────────────────────
function obtenerEmoji(categoria) {
    const emojis = {
        verdura:   '🥬',
        fruta:     '🍉',
        tuberculo: '🥔',
        otro:      '🌿'
    };
    return emojis[categoria] || '🌿';
}

// ── Filtros ────────────────────────────────────────────────────
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const categoria = btn.dataset.categoria;
        if (categoria === 'todos') {
            renderProductos(todosLosProductos);
        } else {
            const filtrados = todosLosProductos.filter(p => p.categoria === categoria);
            renderProductos(filtrados);
        }
    });
});

// ── Agregar al carrito ─────────────────────────────────────────
function agregarAlCarrito(id, nombre, precio,granjero, whatsapp) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    if (
    carrito.length > 0 &&
    carrito[0].granjero !== granjero
) {
    alert(
        'Solo puedes comprar productos de un mismo granjero por pedido.'
    );
    return;
}
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1, granjero, whatsapp });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();

    // Feedback visual en el botón
    const botones = document.querySelectorAll('.card-footer button');
    botones.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes(`${id},`)) {
            const textoOriginal = btn.textContent;
            btn.textContent = '✓ Agregado';
            btn.style.background = '#2d6b33';
            setTimeout(() => {
                btn.textContent = textoOriginal;
                btn.style.background = '';
            }, 1000);
        }
    });
}

// ── Iniciar ────────────────────────────────────────────────────
actualizarContadorCarrito();
cargarProductos();