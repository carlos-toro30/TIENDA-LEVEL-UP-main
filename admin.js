document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una sesión activa con rol de ADMIN
    const sesion = JSON.parse(localStorage.getItem('usuarioSesion') || '{}');
    const elementosAdmin = document.querySelectorAll('.solo-admin');

    if (sesion.rol === 'ADMIN') {
        // Mostrar herramientas exclusivas de administrador
        elementosAdmin.forEach(el => el.style.display = 'block');
    } else {
        // Ocultar herramientas si es un cliente normal o un usuario no logueado
        elementosAdmin.forEach(el => el.style.display = 'none');
    }
});