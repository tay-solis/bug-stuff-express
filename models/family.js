const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const FamilySchema = new Schema({
    name: String,
    // order: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Order'
    // },
    genera: [{
        type: Schema.Types.ObjectId,
        ref: 'Genera'
    }],
});

const Family = mongoose.model('Family', FamilySchema)
module.exports = Family;