const  mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    }, 
    email:{
        type:String, 
        required:true
    },
    password:{
        type:String,
        required:true
    },
    street:{
        type:String,
        default: null
    },
    appartment:{
        type:String, 
        default: null
    },
    country:{
        type:String, 
        default:null
    },
    city:{
        type:String,
        default:null
    },
    zip:{
        type:Number, 
        deafult:null
    },
    phone:{
        type:Number,
        default: null

    }, 
    isAdmin:{
        type:Boolean, 
        default: false
    }, 
});
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
userSchema.set('toJSON', {
    virtual:true
})
exports.User = mongoose.model('User',userSchema );
exports.userSchema = userSchema;