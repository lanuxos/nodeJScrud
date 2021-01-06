let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

router.get('/', (req, res, next) => { 
    dbCon.query('SELECT * FROM books ORDER BY id', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('books', { data: '' });
        } else {
            res.render('books',{data: rows});
        }
    })
})

router.get('/add', (req, res, next) => {
    res.render('books/add', {
        name: '',
        author: ''
    })
})

router.post('/add', (req, res, next) => {
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error', 'Pleas enter name and author');
        res.render('books/add', {name: name, author: author})
    }

    if (!errors) {
        let form_data = {
            name: name, 
            author: author
        }

        dbCon.query('INSERT INTO books SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('books/add', {name: form_data.name, author: form_data.author})
            } else {
                req.flash('success', 'Book already added to database');
                res.redirect('/books');
            }
        })
    }
})

router.get('/edit/(:id)', (req, res, next) => {
    let id = req.params.id;

    dbCon.query('SELECT * FROM books WHERE id = ' + id, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'Book not found via your select id' + id);
            res.redirect('/books');
        } else {
            res.render('books/edit', {
                title: 'Edit Book',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    });
})

router.post('/update/:id', (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error', 'Please enter name and author');
        res.render('books/edit', {
            id: req.params.id,
            name: name,
            author: author
        })
    }
    if (!errors) {
        let form_data = {
            name: name, author: author
        }
        dbCon.query("UPDATE books SET ? WHERE id = " + id, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('books/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        })
    }
})

router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;
    
    dbCon.query('DELETE FROM books WHERE id = ' + id, (err, result) => {
        if (err) {
            req.flash('errors', err);
            res.redirect('/books');
        } else {
            req.flash('success', 'Book successfully deleted');
            res.redirect('/books');
        }
    })
})

module.exports = router;