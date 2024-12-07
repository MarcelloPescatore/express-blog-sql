const posts = require('../db/db.js')
const fs = require('fs')
const connection = require('../db/connection')

// index: ritornerà un html con una ul che stamperà la lista dei post
// const index = (req, res) => {
//     let markup = ''

//     posts.forEach(post => {
//         const { title, slug, content, image, tags } = post;

//         return markup += `
//             <li>
//                 <h2>${title}</h2>
//                 <h3>${slug}</h3>
//                 <h4>${content}</h4>
//                 <img src="/imgs/posts/${image}"</img> <br>
//                 <span>${tags}</span>
//             </li>
//         `
//     });

//     return res.send(`<ul>${markup}</ul>`)
// };

//  la rotta index creata ieri (commentala via) e ricreala restituendo un JSON con la lista dei posts invece di un ul.

const index = (req, res) => {
    // prepare a sql query to get all posts from the db
    const sql = 'SELECT * FROM posts'
    // execute the query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const responseData = {
            data: results,
            counter: results.length
        }

        res.status(200).json(responseData);
    })

    /*  res.status(202).json({
         data: posts,
         counter: posts.length
     }) */
}

// show: tramite il parametro dinamico che rappresenta lo slug del post, ritornerà un json con i dati del post
const show = (req, res) => {

    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug.toLowerCase());
    if (!post) {
        return res.status(404).json({
            error: `404! Not found`
        })
    }

    return res.status(200).json({
        data: post
    })
}

// Creare inoltre un filtro in querystring per tag, che ritorna in formato json tutti i post che hanno quei tag
const filter = (req, res) => {
    const { tag } = req.query;
    console.log(tag);


    if (!tag) {
        return res.status(400).json({ error: 'Nessun tag specificato' });
    }

    // utilizzo filter per filtrare i post che includono tag
    const postsFiltrati = posts.filter(post => post.tags.includes(tag));
    console.log(postsFiltrati);


    return res.status(200).json({
        data: postsFiltrati
    });
}


// Aggiungi il metodo store per la creazione di un nuovo post
const store = (req, res) => {
    const post = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: [req.body.tags]
    }

    posts.push(post);

    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)

    res.json({
        status: 201,
        data: posts,
        counter: posts.length
    })
}

// Update post
const update = (req, res) => {
    // prima devo trovare il post da modificare, attraverso il titolo
    const { title } = req.params;


    // ora cerco l'indice del post attraverso il titolo
    const postIndex = posts.findIndex(post => post.title.toLowerCase() === title.toLowerCase());

    // verifico se esiste un post con quel titolo
    if (postIndex === -1) {
        return res.status(404).json({
            status: 404,
            message: "Il post che vuoi modificare non è stato trovato"
        })
    }

    // vado a modificare direttamente il post a quell'indice
    posts[postIndex] = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: [req.body.tags]
    }

    // aggiorno il file 
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)

    res.json({
        status: 201,
        message: "Post modificato con successo",
        data: posts,
        counter: posts.length
    })
}

// delete post
const destroy = (req, res) => {

    console.log(req.params);


    //1. take the resource id from the request
    const id = req.params.id

    //2. prepare the sql query to delete the record form the db
    const sql = 'DELETE FROM posts WHERE id=?'

    //3. perform the prepared statement query
    connection.query(sql, [id], (err, results) => {
        console.log(err, results);
        if (err) return res.status(500).json({ error: err })
        //4. handle a 404 error if the record is not found
        if (results.affectedRows === 0) return res.status(404).json({ error: `404! No posts found with the this id: ${id}` })

        return res.json({ status: 204, affectedRows: results.affectedRows })

    })

    /* // trova il post dal titolo
    const post = posts.find(post => post.title.toLowerCase() === req.params.title.toLowerCase())

    // controlliamo se il post è presente
    if (!post) {
        return res.status(404).json({ error: "No post found with that title" })
    }

    // rimuoviamo il post restituendo un nuovo array senza quel post
    const newPosts = posts.filter(post => post.title.toLowerCase() !== req.params.title.toLowerCase())

    // aggiorniamo il file 
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(newPosts, null, 4)}`)

    // restituiamo gli elementi aggiornati 
    res.status(200).json({
        status: 200,
        data: newPosts,
        counter: newPosts.length
    }) */
}

module.exports = {
    index,
    show,
    store,
    filter,
    update,
    destroy
}