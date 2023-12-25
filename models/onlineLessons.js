const mongoose = require('mongoose');

const onlineLessonsSchema = mongoose.Schema({
    type: {type: String, required: true},
    price: {type : Number,required: true,default:0},
    duration: {type: String},
});

onlineLessonsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

onlineLessonsSchema.set('toJSON', {
    virtuals: true,
});

exports.OnlineLessons = mongoose.model('OnlineLessons', onlineLessonsSchema);