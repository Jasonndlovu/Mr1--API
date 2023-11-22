const mongoose = require('mongoose');

const strategySchema = mongoose.Schema({
    name: {type: String,required: true},
    subText:{type:String,required: true,},
    strategyDetails: {type: String,default: ''},
    image:{type: String,default: ''},
    // images:[{type: String}],
})

strategySchema.virtual('id').get(function (){return this._id.toHexString();});
strategySchema.set('toJSON', {virtuals: true,});

exports.Strategy = mongoose.model('Strategy', strategySchema);