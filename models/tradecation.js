const mongoose = require('mongoose');

const tradecationSchema = mongoose.Schema({
    Location: {type: String, required: true},
    Period: {type: String},
    AvaibleSlots: {type : Number},
    price: {type : Number,required: true,default:0},
});

tradecationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

tradecationSchema.set('toJSON', {
    virtuals: true,
});

exports.Tradecation = mongoose.model('Tradecation', tradecationSchema);