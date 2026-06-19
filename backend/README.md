# Backend - Proyecto ISW306

## Descripción

Este backend fue desarrollado con Node.js y Express para procesar el formulario de contacto y almacenar la información en una base de datos MySQL.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- XAMPP
- CORS

## Instalación

1. Clonar el repositorio.
2. Abrir una terminal en la carpeta `backend`.
3. Instalar las dependencias:

```bash
npm install
```

4. Iniciar MySQL desde XAMPP.

5. Crear la base de datos `mi_app_web`.

6. Ejecutar el archivo `database.sql`.

7. Iniciar el servidor:

```bash
node server.js
```

## Servidor

El servidor se ejecuta en:

```
http://localhost:3000
```

## Funcionalidad

El backend recibe los datos del formulario de contacto mediante una petición POST y los almacena en la tabla `contactos` de la base de datos `mi_app_web`.