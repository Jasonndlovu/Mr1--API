const mongoose = require('mongoose');

const signalSchema = mongoose.Schema({
    name: {type: String,required: true},
    subText:{type:String,required: true,},
    strategyDetails: {type: String,default: ''},
    image:{type: String,default: ''},
    date: {type: Date,default: Date.now},
    // images:[{type: String}],
})

signalSchema.virtual('id').get(function (){return this._id.toHexString();});
signalSchema.set('toJSON', {virtuals: true,});

exports.Signal = mongoose.model('Signal', signalSchema);