const API_URL = "http://localhost:3000";

const avisoNoAutenticado = document.getElementById("avisoNoAutenticado");
const contenidoAdmin = document.getElementById("contenidoAdmin");
const tablaContactos = document.getElementById("tablaContactos");
const btnLogout = document.getElementById("btnLogout");

const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");

// =========================================================
// 1. Verificar si hay sesión activa antes de mostrar nada
// =========================================================
async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_URL}/sesion`, {
            credentials: "include"
        });
        const datos = await respuesta.json();

        if (!datos.autenticado) {
            avisoNoAutenticado.hidden = false;
            contenidoAdmin.hidden = true;
            return;
        }

        contenidoAdmin.hidden = false;
        cargarContactos();

    } catch (error) {
        avisoNoAutenticado.hidden = false;
        console.log(error);
    }
}

// =========================================================
// 2. READ — Cargar y pintar los contactos en la tabla
// =========================================================
async function cargarContactos() {
    try {
        const respuesta = await fetch(`${API_URL}/contactos`, {
            credentials: "include"
        });

        if (!respuesta.ok) {
            throw new Error("No autorizado o error del servidor.");
        }

        const contactos = await respuesta.json();

        if (contactos.length === 0) {
            tablaContactos.innerHTML = `
                <tr><td colspan="5" class="text-center text-muted">No hay contactos registrados todavía.</td></tr>
            `;
            return;
        }

        tablaContactos.innerHTML = contactos
            .map(
                (c) => `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nombre}</td>
                    <td>${c.correo}</td>
                    <td>${c.mensaje}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${c.id}" data-nombre="${c.nombre}" data-correo="${c.correo}" data-mensaje="${c.mensaje}">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-borrar" data-id="${c.id}">
                            Borrar
                        </button>
                    </td>
                </tr>
            `
            )
            .join("");

        asignarEventosBotones();

    } catch (error) {
        tablaContactos.innerHTML = `
            <tr><td colspan="5" class="text-center text-danger">Error al cargar los contactos.</td></tr>
        `;
        console.log(error);
    }
}

// =========================================================
// 3. Asignar eventos a los botones Editar/Borrar (se regeneran en cada carga)
// =========================================================
function asignarEventosBotones() {
    document.querySelectorAll(".btn-editar").forEach((boton) => {
        boton.addEventListener("click", () => {
            document.getElementById("editarId").value = boton.dataset.id;
            document.getElementById("editarNombre").value = boton.dataset.nombre;
            document.getElementById("editarCorreo").value = boton.dataset.correo;
            document.getElementById("editarMensaje").value = boton.dataset.mensaje;
            modalEditar.show();
        });
    });

    document.querySelectorAll(".btn-borrar").forEach((boton) => {
        boton.addEventListener("click", () => borrarContacto(boton.dataset.id));
    });
}

// =========================================================
// 4. UPDATE — Guardar la edición desde el modal
// =========================================================
btnGuardarEdicion.addEventListener("click", async () => {
    const id = document.getElementById("editarId").value;
    const nombre = document.getElementById("editarNombre").value.trim();
    const correo = document.getElementById("editarCorreo").value.trim();
    const mensaje = document.getElementById("editarMensaje").value.trim();

    if (!nombre || !correo || !mensaje) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/contactos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nombre, correo, mensaje })
        });

        if (!respuesta.ok) {
            throw new Error("Error al actualizar.");
        }

        modalEditar.hide();
        cargarContactos(); // Refrescamos la tabla con los datos actualizados

    } catch (error) {
        alert("No se pudo actualizar el contacto.");
        console.log(error);
    }
});

// =========================================================
// 5. DELETE — Borrar un contacto
// =========================================================
async function borrarContacto(id) {
    const confirmar = confirm("¿Seguro que quieres borrar este contacto? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_URL}/contactos/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!respuesta.ok) {
            throw new Error("Error al borrar.");
        }

        cargarContactos(); // Refrescamos la tabla sin el contacto borrado

    } catch (error) {
        alert("No se pudo borrar el contacto.");
        console.log(error);
    }
}

// =========================================================
// 6. LOGOUT
// =========================================================
btnLogout.addEventListener("click", async () => {
    try {
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
        window.location.href = "login.html";
    } catch (error) {
        console.log(error);
    }
});

// --- Arrancar ---
verificarSesion();
