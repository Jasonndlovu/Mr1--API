const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true,},
    name: {type: String, required: true,},
    surname: {type: String, required: true,},
    email: {type: String, required: true,},
    passwordHash: {type: String, required: true,},
    phone: {type: String, default: '',},
    membership: {type: String, default: ''},
    lessons: {type: String, default: ''},
    image:{type: String,default: ''},
    // zip: {type: String, default: ''},
    // country: {type: String, default: ''},
    isAdmin:{type: Boolean, default: false,},
});

userSchema.virtual('id').get(function (){return this._id.toHexString();});
userSchema.set('toJSON', {virtuals: true,});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;