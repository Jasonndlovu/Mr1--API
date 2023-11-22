const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema({
    
    module:{type: String,required: true},
    video:{type: String,default: ''},
    description:{type: String,default: ''},
    document:{type: String,default: ''},
});

moduleSchema.virtual('id').get(function (){return this._id.toHexString();});
moduleSchema.set('toJSON', {virtuals: true,});

exports.Module = mongoose.model('Module', moduleSchema);

