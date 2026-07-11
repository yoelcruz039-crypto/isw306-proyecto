const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");

const app = express();

// =========================================================
// Middlewares
// =========================================================
app.use(cors({
    origin: "http://127.0.0.1:5500", // Ajusta esto al origen real desde donde abras el frontend (Live Server, etc.)
    credentials: true // Necesario para que las cookies de sesión viajen correctamente
}));
app.use(express.json());

app.use(session({
    secret: "isw306-grupo8-secreto", // En un proyecto real esto NUNCA se deja en el código, va en variables de entorno
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // La sesión dura 1 hora
    }
}));

// =========================================================
// Conexión a MySQL
// =========================================================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mi_app_web"
});

db.connect((err) => {
    if (err) {
        console.log("Error al conectar con MySQL");
        console.log(err);
        return;
    }
    console.log("Conectado a MySQL");
});

// =========================================================
// Autenticación básica (usuario fijo, sin tabla de usuarios)
// =========================================================
const ADMIN_USUARIO = "admin";
const ADMIN_PASSWORD = "grupo8isw306";

function requiereSesion(req, res, next) {
    if (req.session && req.session.autenticado) {
        return next();
    }
    return res.status(401).json({ mensaje: "No autorizado. Debes iniciar sesión." });
}

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// --- LOGIN ---
app.post("/login", (req, res) => {
    const { usuario, password } = req.body;

    if (usuario === ADMIN_USUARIO && password === ADMIN_PASSWORD) {
        req.session.autenticado = true;
        req.session.usuario = usuario;
        return res.json({ mensaje: "Inicio de sesión exitoso." });
    }

    res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
});

// --- LOGOUT ---
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al cerrar sesión." });
        }
        res.json({ mensaje: "Sesión cerrada correctamente." });
    });
});

// --- Verificar si hay sesión activa ---
app.get("/sesion", (req, res) => {
    if (req.session && req.session.autenticado) {
        return res.json({ autenticado: true, usuario: req.session.usuario });
    }
    res.json({ autenticado: false });
});

// =========================================================
// CRUD de "contactos"
// =========================================================

app.post("/contacto", (req, res) => {
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    const sql = "INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)";

    db.query(sql, [nombre, correo, mensaje], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al guardar" });
        }
        res.json({ mensaje: "Mensaje guardado correctamente" });
    });
});

app.get("/contactos", requiereSesion, (req, res) => {
    const sql = "SELECT * FROM contactos ORDER BY id DESC";

    db.query(sql, (err, resultados) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al leer los contactos." });
        }
        res.json(resultados);
    });
});

app.put("/contactos/:id", requiereSesion, (req, res) => {
    const { id } = req.params;
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    const sql = "UPDATE contactos SET nombre = ?, correo = ?, mensaje = ? WHERE id = ?";

    db.query(sql, [nombre, correo, mensaje, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al actualizar el contacto." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Contacto no encontrado." });
        }
        res.json({ mensaje: "Contacto actualizado correctamente." });
    });
});

app.delete("/contactos/:id", requiereSesion, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM contactos WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al borrar el contacto." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Contacto no encontrado." });
        }
        res.json({ mensaje: "Contacto borrado correctamente." });
    });
});

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});