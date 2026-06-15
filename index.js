const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = require("./esquemausuario.js");
const Camiseta = require("./esquemacamiseta");

const app = express();
const PORT = 3000;

const path = require("path");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "fronend")));


function verificarToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Token requerido"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const datos = jwt.verify(
      token,
      "MI_SECRETO_123"
    );

    req.usuario = datos;

    next();

  } catch {

    return res.status(403).json({
      mensaje: "Token inválido"
    });

  }

}

mongoose.connect("mongodb://localhost:27017/camisap")
  .then(() => console.log("MongoDB local conectado correctamente"))
  .catch(error => console.error("Error conectando MongoDB:", error));

// CREAR USUARIO
app.post("/usuarios", async (req, res) => {
  try {

    const claveEncriptada = await bcrypt.hash(req.body.clave, 10);

    const nuevoUsuario = new Usuario({
      nombre: req.body.nombre,
      correo: req.body.correo,
      clave: claveEncriptada
    });

    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json(usuarioGuardado);

  } catch (error) {
    res.status(400).json({
      mensaje: "Error al guardar usuario",
      error
    });
  }
});


// VER USUARIOS
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(usuario);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/camisetas", verificarToken, async (req, res) => {

  try {

    const camiseta = new Camiseta({

    nombre: req.body.nombre,

    descripcion: req.body.descripcion,

    creador: req.usuario.nombre,

    creadorId: req.usuario.id,

    torso: req.body.torso,

    mangaIzquierda: req.body.mangaIzquierda,

    mangaDerecha: req.body.mangaDerecha,

    cuello: req.body.cuello

});

    await camiseta.save();

    res.status(201).json(camiseta);

  } catch(error){

    res.status(400).json(error);

  }

});
app.get("/camisetas", async (req, res) => {

  try {

    const camisetas =
    await Camiseta.find();

    res.json(camisetas);

  } catch(error){

    res.status(500).json(error);

  }

});
app.put(
"/camisetas/:id",
verificarToken,
async (req,res)=>{

    const camiseta =
    await Camiseta.findById(
        req.params.id
    );

    if(!camiseta){

        return res.status(404)
        .json({
            mensaje:"No existe"
        });

    }

    if(
        camiseta.creadorId
        !==
        req.usuario.id
    ){

        return res.status(403)
        .json({
            mensaje:
            "No puedes editar este diseño"
        });

    }

    Object.assign(
        camiseta,
        req.body
    );

    await camiseta.save();

    res.json(camiseta);

});
app.delete(
"/camisetas/:id",
verificarToken,
async (req,res)=>{

    const camiseta =
    await Camiseta.findById(
        req.params.id
    );

    if(!camiseta){

        return res.status(404)
        .json({
            mensaje:"No existe"
        });

    }

    if(
        camiseta.creadorId
        !==
        req.usuario.id
    ){

        return res.status(403)
        .json({
            mensaje:
            "No puedes eliminar este diseño"
        });

    }

    await Camiseta.findByIdAndDelete(
        req.params.id
    );

    res.json({
        mensaje:
        "Diseño eliminado"
    });

});
app.post("/camisetas/:id/votar", async (req, res) => {

  const { puntuacion } = req.body;

  const camiseta = await Camiseta.findById(req.params.id);

  camiseta.votos++;

  camiseta.totalPuntos += puntuacion;

  camiseta.promedio =
    camiseta.totalPuntos /
    camiseta.votos;

  await camiseta.save();

  res.json(camiseta);

});

// Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {

  try {

    const { correo, clave } = req.body;

    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const coincide = await bcrypt.compare(
      clave,
      usuario.clave
    );

    if (!coincide) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
  {
    id: usuario._id,
    nombre: usuario.nombre,
    correo: usuario.correo
  },
  "MI_SECRETO_123",
  {
    expiresIn: "1h"
  }
);

    res.json({
      mensaje: "Login exitoso",
      token
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error en login"
    });

  }

});

app.get("/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso permitido",
    usuario: req.usuario
  });
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("Ruta LOGIN cargada");
});
