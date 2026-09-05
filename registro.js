// ==========================================
// REGISTRO DE NUEVOS USUARIOS (En registro.html o modal)
// ==========================================
const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('reg-nombre').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const rol = document.getElementById('reg-rol') ? document.getElementById('reg-rol').value : 'CLIENTE';

        // Validaciones básicas
        if (nombre === '' || email === '' || password.length < 6) {
            alert('Por favor completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Obtener lista de usuarios guardados o inicializar array vacío
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosDB')) || [];

        // Validar si el correo ya existe
        const existe = usuariosRegistrados.find(user => user.email === email);
        if (existe) {
            alert('El correo ya se encuentra registrado.');
            return;
        }

        // Guardar nuevo usuario
        const nuevoUsuario = { nombre, email, password, rol };
        usuariosRegistrados.push(nuevoUsuario);
        localStorage.setItem('usuariosDB', JSON.stringify(usuariosRegistrados));

        alert(`¡Cuenta creada con éxito como ${rol}! Ahora puedes iniciar sesión.`);
        window.location.href = 'inicio.html';
    });
}