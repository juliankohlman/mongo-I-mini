const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bear = require('./Bears/BearModel.js');

const server = express();

server.use(helmet()); // https://helmetjs.github.io/
server.use(cors());   // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());


// connect server with mongoDB server


server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

// POST:CREATE
server.post('/api/bears', (req, res) => {
  const bearInfo = req.body;

  // mongoose document
  const newbear = new bear(bearInfo);
  newbear.save() // returns a promixe
    .then((savedBear) => {
      res.status(201).json(savedBear);
    }).catch((err => {
      res.status(500).json({err: 'there was an erro while saving bear to the database',})
    }));
})

mongoose
  .connect('mongodb://localhost/BearKeeper') // returns a promise
  .then(db => {
    console.log('Successfully connected to MongoDB', db);
  }).catch(err => {
    console.error('database connection fubar')
  })

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});

// Client (JS OBJECTS) <JSON> [API (JSObjects) mongoose] <BSON> MongoDB (BSON) ---- Dataset]
// Mongoose ==> ODM's translating JSObjects to BSON from and to