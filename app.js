const express = require('express');
const path = require('path');
const dotenvResult = require('dotenv').config();
const app = express();
const port = 3002;
const HOST =  'http://localhost'

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

// middleware errori
const notFoundMiddleware = require('./middlewares/notFound.js')
const loggerMiddleware = require('./middlewares/loggerMiddleware.js')
// importo le rotte
const PostsRouter = require('./routing/posts.js');

app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
// asset publici
app.use(express.static('public'))
// middleware 
app.use(express.json());

// middleware richiesta rotte
app.use('/', loggerMiddleware)

// middleware per attivare un errore 500
/* app.use('/posts', (req, res, next) => {
    throw new Error("You broke everything dude! 💥");
});  */
/* app.use('/posts', (req, res, next) => {
    const error = new Error("You broke everything dude! 💥");
    next(error);
});  */

// Posts API 
app.use('/posts', PostsRouter);

// start the server
app.listen(port, (req, res) => {
    console.log(`Server is running at ${HOST}:${port}`);   
})

// richiamo middleware erroi rotta non trovata
app.use(notFoundMiddleware)

// Ultimo middleware per gestire gli errori
app.use((err, req, res, next) => {
    console.log("Error: ", err.message);
    // questo stampa lo stack trace dell'errore
    console.error(err.stack);
    res.status(500).send({
      message: "Something went wrong",
      error: err.message
    })
});