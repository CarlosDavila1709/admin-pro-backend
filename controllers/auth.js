const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

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

module.exports = {
    login
}