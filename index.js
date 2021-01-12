require('dotenv').config();

const express  = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const app = express();

// Configurar CORS
app.use( cors() );

//Base de datos
dbConnection();
console.log( process.env );

// user: mean_user 
// pass: 9P7KlMkcBYeprT7e
//Rutas
app.get( '/', (req,resp) => {

    resp.json({
        ok: true,
        msg: "hola mundo"
    })
});

app.listen( process.env.PORT, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
});