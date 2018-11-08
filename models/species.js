const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const SpeciesSchema = new Schema({
	commonName: String,
	speciesName: String,
	genusName: String,
    genus: {
        type: Schema.Types.ObjectId,
        ref: 'Genus'
    },
	// image: String,
	// summary: String,
	// description: String,
	// link: String
});

const Species = mongoose.model('Species', SpeciesSchema)
module.exports = Species;
