const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');

// intializations 
const app = express();
require('./lib/passport');

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
app.use(session({
    secret: 'g4brieljs',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
// Esto nos permite enviar mensaje através de distintas vistas
app.use(flash());
// son funciones que se ejecutan cada vez que se envia un dato a la db
app.use(morgan('dev'));
// Morgan muestra por consola las peticiones que van llegando
// Esto sirve para poder aceptar los datos que me envien los usuarios
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//passport
app.use(passport.initialize());
app.use(passport.session());

// Global variables EXPRESS / todas las variables que mi programa necesite // Cuando nos autentiquemos podremos acceder a estas informaciones
app.use((req, res, next) => {
    // req = toma los datos del usuario 
    // res = Lo que el sever quiere responder
    // next = pasa a la siguiente parte del codigo
    // ESTO nos permite acceder a variables desde cualquier parte de la aplicacion
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    
    next();
}); 


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