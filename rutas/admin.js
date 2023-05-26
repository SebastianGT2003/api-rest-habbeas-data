const express= require('express')
const router= express.Router()
const bycrypt= require('bcrypt')

const mongoose= require('mongoose')
const eschema= mongoose.Schema
const saltRounds=10

/// Esquema de base de datos 

const eschemauadmin= new eschema({
    nombre: {type: String, requiere: true, unique: true},
    contraseña: {type: String, requiere: true},
});

const ModeloAdmin= mongoose.model('admins', eschemauadmin)

module.exports= router
