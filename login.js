const formLogin = document.getElementById("formLogin");
const errorLogin = document.getElementById("errorLogin");

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // IMPORTANTE: permite que la cookie de sesión se guarde
            body: JSON.stringify({ usuario, password })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            errorLogin.textContent = datos.mensaje;
            errorLogin.hidden = false;
            return;
        }

        // Login exitoso: redirigimos al panel de administración
        window.location.href = "admin.html";

    } catch (error) {
        errorLogin.textContent = "No se pudo conectar con el servidor. ¿Está corriendo node server.js?";
        errorLogin.hidden = false;
        console.log(error);
    }
});
