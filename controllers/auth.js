const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try{

        // Verificar email
        const usuarioBD = await Usuario.findOne({email} );

        if( !usuarioBD ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no valida',
            });
        }

        //Verificar contraseña
        const validaPassword = bcrypt.compareSync( password, usuarioBD.password );

        if( !validaPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida',
            });
        }

        // Generar TOKEN -JWT
        const token = await generarJWT( usuarioBD.id );


        res.json({
            ok: true,
            token
        });

    }catch(error){

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador',
        });
    }

}

const googleSignIn = async( req, res = response) => {

    const googleToken = req.body.token;

    try{

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioBD = await Usuario.findOne({ email });

        let usuario  ;

        if( !usuarioBD ){
            //Si no existe el usuario
            usuario = new Usuario({ 
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            // Existe usuario
            usuario = usuarioBD;
            usuario.google = true;
        }

        await usuario.save();

        // Generar TOKEN -JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            token
        });

    }catch( error ){

        res.status(401).json({
            ok: false,
            msg: "Token no es correcto",
        
        });
    }

}

module.exports = {
    login,
    googleSignIn
}