import app from './server.js';

// Iniciar el servidor en el puerto configurado
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});