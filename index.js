require('dotenv').config();

const express  = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const app = express();

// Configurar CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

//Base de datos
dbConnection();

//Rutas
app.use( '/api/usuarios' , require('./routers/usuarios') );
app.use( '/api/hospitales' , require('./routers/hospitales') );
app.use( '/api/medicos' , require('./routers/medicos') );
app.use( '/api/todo' , require('./routers/busquedas') );
app.use( '/api/login' , require('./routers/auth') );
app.use( '/api/uploads' , require('./routers/uploads') );

app.listen( process.env.PORT, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
});