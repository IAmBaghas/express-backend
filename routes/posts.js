const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/database');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, function (req, res) {
    const query = `
        SELECT posts.id, posts.title, posts.content, users.username AS poster
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.id DESC
    `;
    connection.query(query, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Posts',
                data: rows
            });
        }
    });
});

// Store a new post with user_id
router.post('/store', authenticateToken, [
    body('title').notEmpty(),
    body('content').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const { title, content } = req.body;
    const userId = req.user.id; // Assuming req.user contains the authenticated user's info

    const formData = {
        title,
        content,
        user_id: userId
    };

    connection.query('INSERT INTO posts SET ?', formData, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            });
        }
    });
});

// Get a single post by ID (protected)
router.get('/:id', authenticateToken, function (req, res) {
    let id = req.params.id;

    connection.query(`SELECT * FROM posts WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Post Not Found!',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data Post',
                data: rows[0]
            });
        }
    });
});

// Update a post by ID (protected)
// Update a post by ID (protected)
router.patch('/update/:id', authenticateToken, [
    body('title').notEmpty(),
    body('content').notEmpty()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let id = req.params.id;

    let formData = {
        title: req.body.title,
        content: req.body.content
    };

    connection.query(`UPDATE posts SET ? WHERE id = ${id}`, formData, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!'
            });
        }
    });
});

// Delete a post by ID (protected)
router.delete('/delete/:id', authenticateToken, function (req, res) {
    let id = req.params.id;

    connection.query(`DELETE FROM posts WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            });
        }
    });
});

module.exports = router;
