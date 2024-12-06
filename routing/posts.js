// file che gestisce le rotte
const express = require('express');
const PostsController = require('../controllers/PostsController.js');
const router = express.Router();

// rotta di index
router.get('/', PostsController.index);
// rotta per tag
router.get('/filter', PostsController.filter);
// Crea un nuovo post
router.post('/store', PostsController.store); 
// Modifico un post
router.put('/:title', PostsController.update); 
// rotta di show
router.get('/:slug', PostsController.show);
// rotta delete
router.delete('/:title', PostsController.destroy)

module.exports = router;