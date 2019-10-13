const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add'); 
});

router.post('/add', isLoggedIn, async (req, res) => {
    // los datos del form esta en request.body
    const { title, url, description } = req.body;
    const newLink = {
        // esto lo creamos asi para enlazarlo a los usarios
        title,
        url,
        description,
        user_id: req.user.id
    }
    // esto es una peticion asyncrona, tambien con callbacks, y promises(promify)
    await pool.query('INSERT INTO links set ?', [newLink]);
    // Toma dos parametros: 1-nombre del mensaje 2:Valor del mensaje
    req.flash('success', 'Link saved succesfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/listas', {links});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('message', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    }
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Update Successfully');
    res.redirect('/links');
});

module.exports = router;