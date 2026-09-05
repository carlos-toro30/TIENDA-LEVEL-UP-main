// Base de datos local de productos para mapear en principal.html
const productosDB = [
    { id: 1, titulo: 'Consola PS5 Digital', precio: 549990, imagen: 'https://via.placeholder.com/300x200?text=PS5+Digital' },
    { id: 2, titulo: 'Teclado Mecánico RGB', precio: 45990, imagen: 'https://via.placeholder.com/300x200?text=Teclado+RGB' },
    { id: 3, titulo: 'Mouse Gamer 16000 DPI', precio: 29990, imagen: 'https://via.placeholder.com/300x200?text=Mouse+Gamer' },
    { id: 4, titulo: 'Audífonos Gaming 7.1', precio: 39990, imagen: 'https://via.placeholder.com/300x200?text=Audifonos+7.1' },
    { id: 5, titulo: 'Silla Gamer Ergonómica', precio: 129990, imagen: 'https://via.placeholder.com/300x200?text=Silla+Gamer' },
    { id: 6, titulo: 'Monitor Gamer 144Hz', precio: 189990, imagen: 'https://via.placeholder.com/300x200?text=Monitor+144Hz' },
    { id: 7, titulo: 'Mando Inalámbrico', precio: 59990, imagen: 'https://via.placeholder.com/300x200?text=Mando+Xbox/PS' },
    { id: 8, titulo: 'Polera Level-Up Edition', precio: 14990, imagen: 'https://via.placeholder.com/300x200?text=Polera+LevelUp' }
];

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. INICIO DE SESIÓN (inicio.html / inicio_2.html)
    // ==========================================
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-pass');

            const errEmail = document.getElementById('err-login-email');
            const errPass = document.getElementById('err-login-pass');

            if (errEmail) errEmail.innerText = '';
            if (errPass) errPass.innerText = '';

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passInput ? passInput.value.trim() : '';

            let esValido = true;

            if (email === '') {
                if (errEmail) errEmail.innerText = 'Por favor, ingresa tu correo electrónico.';
                esValido = false;
            }

            if (password === '') {
                if (errPass) errPass.innerText = 'Por favor, ingresa tu contraseña.';
                esValido = false;
            }

            if (!esValido) return;

            // AUTENTICACIÓN ADMINISTRADOR
            if (email.toLowerCase() === 'admin@levelup.cl' && password === 'admin123') {
                const sesionAdmin = { nombre: 'Administrador Level UP', email: email, rol: 'ADMIN' };
                localStorage.setItem('usuarioSesion', JSON.stringify(sesionAdmin));
                alert('¡Bienvenido Administrador!');
                window.location.href = 'principal.html';
                return;
            }

            // AUTENTICACIÓN CLIENTE
            const usuariosDB = JSON.parse(localStorage.getItem('usuariosDB')) || [];
            const usuarioEncontrado = usuariosDB.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

            if (usuarioEncontrado) {
                const sesionCliente = { nombre: usuarioEncontrado.nombre, email: usuarioEncontrado.email, rol: usuarioEncontrado.rol || 'CLIENTE' };
                localStorage.setItem('usuarioSesion', JSON.stringify(sesionCliente));
                alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);
                window.location.href = 'principal.html';
            } else if (password.length >= 6) {
                const sesionCliente = { nombre: 'Cliente Gamer', email: email, rol: 'CLIENTE' };
                localStorage.setItem('usuarioSesion', JSON.stringify(sesionCliente));
                alert('¡Inicio de sesión exitoso!');
                window.location.href = 'principal.html';
            } else {
                if (errPass) errPass.innerText = 'Contraseña incorrecta (mínimo 6 caracteres).';
            }
        });
    }

    // Inicializar estado del carrito y vista
    actualizarContadorCarrito();
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
});

// ==========================================
// 2. FUNCIONES GLOBALES DEL CARRITO DE COMPRAS
// ==========================================

// Actualiza el contador de ítems en el header de todas las páginas
function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cartCount.innerText = totalCantidad;
    }
}

// Añadir productos al carrito (Invocado desde onclick en principal.html)
window.addToCart = function(idProducto) {
    const producto = productosDB.find(p => p.id === idProducto);
    if (!producto) return;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(p => p.id === idProducto);

    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`¡${producto.titulo} agregado al carrito!`);
};

// Dibujar los productos dentro de la página carro.html
window.renderCartPage = function() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    if (!container) return;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    container.innerHTML = '';

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="blog-card" style="padding: 20px; color: #FFF; text-align: center;">
                <p>Tu carrito está actualmente vacío.</p>
                <a href="principal.html" class="blog-btn" style="text-decoration: none; display: inline-block; margin-top: 10px;">Ir a la tienda</a>
            </div>
        `;
        if (totalElement) totalElement.innerText = '$0';
        return;
    }

    let total = 0;

    carrito.forEach((prod, index) => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'blog-card';
        itemDiv.style = 'padding: 15px; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;';
        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${prod.imagen}" alt="${prod.titulo}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 4px;">
                <div>
                    <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #FFF;">${prod.titulo}</h4>
                    <span style="font-size: 13px; color: #D3D3D3;">$${prod.precio.toLocaleString('es-CL')} x ${prod.cantidad}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 20px;">
                <span style="color: #39FF14; font-weight: bold; font-family: 'Orbitron';">$${subtotal.toLocaleString('es-CL')}</span>
                <button onclick="removeFromCart(${index})" style="background: #FF003C; color: #FFF; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Eliminar</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    // Descuento persistente si fue aplicado
    const descuentoAplicado = localStorage.getItem('descuentoAplicado');
    if (descuentoAplicado) {
        total = total * (1 - parseFloat(descuentoAplicado));
    }

    if (totalElement) {
        totalElement.innerText = '$' + Math.round(total).toLocaleString('es-CL');
    }
};

// Eliminar un producto por índice
window.removeFromCart = function(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    if (carrito.length === 0) {
        localStorage.removeItem('descuentoAplicado');
    }

    renderCartPage();
    actualizarContadorCarrito();
};

// Aplicar cupón de descuento
window.applyDiscountCoupon = function() {
    const input = document.getElementById('coupon-input');
    const info = document.getElementById('discount-info');
    if (!input) return;

    const cupon = input.value.trim().toUpperCase();

    if (cupon === 'LEVELUP10') {
        localStorage.setItem('descuentoAplicado', '0.10'); // 10% de descuento
        if (info) {
            info.style.display = 'block';
            info.innerText = '¡Cupón LEVELUP10 (10% OFF) aplicado!';
        }
        renderCartPage();
    } else {
        alert('Cupón no válido. Intenta con LEVELUP10');
    }
};

// Procesar el pago
window.processCheckout = function() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de pagar.');
        return;
    }

    alert('¡Gracias por tu compra en Level-Up Gamer! Tu pedido ha sido procesado.');
    localStorage.removeItem('carrito');
    localStorage.removeItem('descuentoAplicado');
    window.location.href = 'principal.html';
};