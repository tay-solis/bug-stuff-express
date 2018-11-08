const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const OrderSchema = new Schema({
    name: String,
    summary: String,
    image: String,
    families: [{
        type: Schema.Types.ObjectId,
        ref: 'Families'
    }],
    link: String
});

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order;