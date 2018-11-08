const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const GenusSchema = new Schema({
    name: String,
    species: [{
        type: Schema.Types.ObjectId,
        ref: 'Species'
    }],
});

const Genus = mongoose.model('Genus', GenusSchema)
module.exports = Genus;