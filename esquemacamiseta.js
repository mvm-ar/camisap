const mongoose = require("mongoose");

const camisetaSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  descripcion: {
    type: String,
    default: ""
  },

  creador: {
    type: String,
    required: true
  },

  creadorId: {
    type: String,
    required: true
},

  torso: {
    type: String,
    default: "#ffffff"
  },

  mangaIzquierda: {
    type: String,
    default: "#ffffff"
  },

  mangaDerecha: {
    type: String,
    default: "#ffffff"
  },

  cuello: {
    type: String,
    default: "#ffffff"
  },

  votos: {
    type: Number,
    default: 0
  },

  totalPuntos: {
    type: Number,
    default: 0
  },

  promedio: {
    type: Number,
    default: 0
  }

});

module.exports = mongoose.model("Camiseta", camisetaSchema);