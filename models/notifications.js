const mongoose = require('mongoose');

const notificationsSchema = mongoose.Schema({
    pair: {type: String, required: true},
    sub: {type: String},
    signal: {type: String},
    timeFrame: {type:String},
    date: {type: Date,default: Date.now},
});

notificationsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

notificationsSchema.set('toJSON', {
    virtuals: true,
});

exports.Notifications = mongoose.model('Notifications', notificationsSchema);