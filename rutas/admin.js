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

router.get('/ejemplo', (req, res)=>{
    res.end('Saludo carga desde ruta ejemplo')
})


/* router.post('/aute',(req, res )=>{
    const{nombre, contraseña}=req.body;
    

    ModeloAdmin.findOne({nombre}, (err, user)=>{
        if (err){
            res.status(500).send('Error al autenticar al usuario')

        }else if(!user){
            res.send('El usuario no existe')
        }else{
            user.IsCorrectPassword(contraseña,(err, result)=>{
                if(err){
                    res.send('Error al autenticar al usuario')
                }else if(result){
                    res.send('Usuario autenticado correctamente')

                }else{
                    res.send('Usuario y/o contraselña incorrecta')
                }
                
            })
        }
    })


})
 */
router.post('/auth', (req, res) => {
    const { nombre, contraseña } = req.body;
  
    ModeloAdmin.findOne({ nombre }, (err, user) => {
      if (err) {
        res.status(500).send('Error al autenticar al usuario');
      } else if (!user) {
        res.send('El usuario no existe');
      } else {
        if (user.contraseña === contraseña) {
          res.send('Usuario autenticado correctamente');
        } else {
          res.send('Usuario y/o contraseña incorrecta');
        }
      }
    });
  });
  

router.post('/registrar', (req, res )=>{

    const{nombre,contraseña}=req.body;

    const nuevousuario=ModeloAdmin({
        nombre: nombre,
        contraseña:contraseña,


    })
    ModeloAdmin.findOne({nombre}, (err, user)=>{
        if (err){
            res.status(500).send('Error al autenticar al usuario')

        }else if(!user){
            nuevousuario.save(function(err){
                if (!err){
                    res.send('Usuario registrado correctamente')
        
                }else{
                    res.send(err)
                }
            })
        }else{
            res.send('El usuario ya existe')
        }
    })
} )



eschemauadmin.methods.IsCorrectPassword= function(contraseña, callback){
    bycrypt.compare(contraseña, this.contraseña, function(err,same){
        if (err){
            callback(err);
        }else{
            callback(err, same)
        }
    })
}

eschemauadmin.pre('save', function(next){
    if(this.isNew || this.isModified('contraseña')){

        const document= this;

        bycrypt.hash(document.contraseña, saltRounds,(err,hashedPassword)=>{

            if (err){
                next(err);
            }else{
                document.contraseña=hashedPassword;
                next()
            }
        })

    }else{
        next();
    }
})