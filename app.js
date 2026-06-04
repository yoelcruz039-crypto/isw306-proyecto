const form = document.getElementById('formContacto');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const txtMensaje = document.getElementById('mensaje');
const feedback = document.getElementById('mensajeFeedback');

let mensajesGuardados = JSON.parse(localStorage.getItem('mensajesWeb')) || [];

// FUNCIONES MODULARES 
function validarNombre() {
    if (inputNombre.value.trim().length < 3) {
        feedback.textContent = "El nombre debe tener al menos 3 caracteres.";
        feedback.className = "feedback-msg error-active";
        inputNombre.classList.add('input-error');
        inputNombre.classList.remove('input-success');
        return false;
    }
    inputNombre.classList.add('input-success');
    inputNombre.classList.remove('input-error');
    return true;
}

function validarCorreo() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputCorreo.value.trim())) {
        feedback.textContent = "Por favor, introduce un correo electrónico válido.";
        feedback.className = "feedback-msg error-active";
        inputCorreo.classList.add('input-error');
        inputCorreo.classList.remove('input-success');
        return false;
    }
    inputCorreo.classList.add('input-success');
    inputCorreo.classList.remove('input-error');
    return true;
}

function validarMensaje() {
    if (txtMensaje.value.trim() === "") {
        feedback.textContent = "El campo de mensaje no puede estar vacío.";
        feedback.className = "feedback-msg error-active";
        txtMensaje.classList.add('input-error');
        txtMensaje.classList.remove('input-success');
        return false;
    }
    txtMensaje.classList.add('input-success');
    txtMensaje.classList.remove('input-error');
    return true;
}


inputNombre.addEventListener('input', () => {
    if (inputNombre.value.trim().length >= 3) {
        feedback.className = "feedback-msg";
        inputNombre.classList.remove('input-error');
    }
});

inputCorreo.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputCorreo.value.trim())) {
        feedback.className = "feedback-msg";
        inputCorreo.classList.remove('input-error');
    }
});

txtMensaje.addEventListener('input', () => {
    if (txtMensaje.value.trim() !== "") {
        feedback.className = "feedback-msg";
        txtMensaje.classList.remove('input-error');
    }
});

inputNombre.addEventListener('input', () => {
    if (inputNombre.value.trim().length >= 3) {
        feedback.className = "feedback-msg";
        inputNombre.classList.remove('input-error');
    }
});

inputCorreo.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputCorreo.value.trim())) {
        feedback.className = "feedback-msg";
        inputCorreo.classList.remove('input-error');
    }
});

txtMensaje.addEventListener('input', () => {
    if (txtMensaje.value.trim() !== "") {
        feedback.className = "feedback-msg";
        txtMensaje.classList.remove('input-error');
    }
});

form.addEventListener('submit', (event) => {
    // Se evita que la página se recargue 
    event.preventDefault();

    // Validaciones robustas antes de procesar
    if (!validarNombre() || !validarCorreo() || !validarMensaje()) {
        return; 
    }

    const nuevoMensaje = {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        mensaje: txtMensaje.value.trim(),
        fecha: new Date().toLocaleString()
    };

    mensajesGuardados.push(nuevoMensaje);
    localStorage.setItem('mensajesWeb', JSON.stringify(mensajesGuardados));

    feedback.textContent = "¡Formulario enviado y guardado con éxito!";
    feedback.className = "feedback-msg success-active";

    form.reset();
});