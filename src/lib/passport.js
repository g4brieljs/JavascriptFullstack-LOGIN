const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            // le pasamos null porque no hubo error, y user para que lo deserialize 
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        }else{
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }else{
        return done(null, false, req.flash('message', 'The Username does not exists'));
    }


}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    // poder recibir más datos
    passReqToCallback: true
}, async (req, username, password, done) => {
    // esto es un callback
    
    const {fullname, b1nombre, b1cedula} = req.body;
    const newUser = {
        username,
        password,
        fullname,
        b1nombre,
        b1cedula
    };
    newUser.password = await helpers.ecryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

// Middleware | Passport nos pide que debmeos Deserializar al user y Deserializarlo 
// aqui vamos a serializar el usuario guardado
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializar el user
// // Tomamos el id que hemos almacenado en serializeUser, y consultamos eso datos del user
passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});