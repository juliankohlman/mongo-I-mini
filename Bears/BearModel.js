const mongoose = require('mongoose');

const BearSchema = new mongoose.Schema({
  species: {
    type: String,
    required: [true, 'Please provide a species for the Bear.']
  },
  latinName: {
    type: String,
    required: [true, 'Please provide a latinName for the Bear.']
  },
  createdOn: {type: Date, default: Date.now, required: true }
})

const BearModel = mongoose.model('Bear', BearSchema);

module.exports = BearModel;