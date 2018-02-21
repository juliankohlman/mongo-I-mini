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

server.post('/api/bears', (req, res) => {
  const bearInfo = req.body;
  const { species, latinName } = req.body;

  if (!species || !latinName) {
    res.status(400).json({errorMessage: 'Please provide both species and latinName for the Bear.'});
  } else {
    const newBear = new bear(bearInfo);
    newBear
      .save()
      .then(newBear => {
        res.status(201).json(newBear);
      })
      .catch(error => {
        res.status(500).json({ error: 'There was an error while saving the Bear to the Database'});
      });
  }
})

server.get('/api/bears', (req, res) => {
  bear
    .find({})
    .then((bears) => {
      res.status(200).json(bears)
    }).catch((error) => {
      res.status(500).json({ error: 'The information could not be retrieved.'})
    });
});

server.get('/api/bears/:id', (req, res) => {
  const id = req.params.id;
  bear.findById(id).then(bear => {
    if (bear) {
      res.status(200).json(bear)
    } else {
      res.status(404).json({message: 'The Bear with the specified ID does not exist.'})
    }
  })
  .catch((error) => {
    res.status(500)
    .json({ error: 'The information could not be retrieved.'})
  });
});

server.delete('/api/bears/:id', (req, res) => {
  const id = req.params.id;
  bear.findByIdAndRemove(id)
    .then(bear => {
      return bear ? res.status(200).json({message: `The bear with ID:${id} was successfully deleted`}) :
             res.status(404).json({ message: 'The Bear with the specified ID does not exist.'});
    }).catch(error => {
      res.status(500).json({ error: 'The Bear could not be removed'});
    })
})

server.put('/api/bears/:id', (req, res) => {
  const id = req.params.id;
  const { species, latinName } = req.body;

  bear.findByIdAndUpdate(id, req.body)
    .then(updateBear => {
      return updateBear ? res.status(201).json(updateBear) :
                          res.status(404).json({error: `The Bear with the ID${id} does not exist.`});
    }).catch(error => {
      res.status(500).json({error: 'The Bear information could not be modified.'});
    })
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