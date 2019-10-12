const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');


// intializations 
const app = express();

// settings 
app.set('port', process.env.PORT || 4000);
// esto me indica el archivo original
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    // creamos un objeto para configurar
    // Como el nombre de la plantilla
    // extensiones - partials - carpetas - etc
    defaultLayout: 'main',
    // path.join esto une directorios - views con layout
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    // nombres de handlebars a hbs
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// MIddlewares son funciones que se ejecutan cada vez que se pide una peticion
// son funciones que se ejecutan cada vez que se envia un dato a la db
app.use(morgan('dev'));
// Morgan muestra por consola las peticiones que van llegando
// Esto sirve para poder aceptar los datos que me envien los usuarios
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global variables EXPRESS / todas las variables que mi programa necesite // Cuando nos autentiquemos podremos acceder a estas informaciones
// app.use((req, res, next) => {
    // req = toma los datos del usuario 
    // res = Lo que el sever quiere responder
    // next = pasa a la siguiente parte del codigo
    // ESTO nos permite acceder a variables desde cualquier parte de la aplicacion

    // });


// Routes 
// Nodejs ya busca el archvio .js
app.use(require('./routes'));
app.use(require('./routes/authentications'));
// le presede un ruta /links
app.use('/links', require('./routes/links'));


// Public Todo el codigo que le navegador puede accder
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});