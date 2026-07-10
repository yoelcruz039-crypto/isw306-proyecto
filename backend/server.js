const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MySQL
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

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// Guardar formulario
app.post("/contacto", (req, res) => {

    const { nombre, correo, mensaje } = req.body;

    const sql =
        "INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)";

    db.query(sql, [nombre, correo, mensaje], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                mensaje: "Error al guardar"
            });
        }

        res.json({
            mensaje: "Mensaje guardado correctamente"
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});