const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema({
    type: {type: String, required: true},
    description: {type: String},
    price: {type : Number,required: true,default:0},
});

membershipSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

membershipSchema.set('toJSON', {
    virtuals: true,
});

exports.Membership = mongoose.model('Membership', membershipSchema);