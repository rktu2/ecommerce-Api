const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        deafult:''
    },
    richdescription:{
        type:String,
        default:''
    },
    image:{
    type:String,
    default:''

    },
    images:[{ 
        type:String,

    }],

    brand:{
        type:String,
        deafult:''
    },
    price:{
        type:Number,
        default:00000
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required:true
    },
    countinstock:{
        type:Number,
        required:true,
        min:0,
        max:255

    },
    rating:{
        type:Number,
        deafult:0

    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    numReview:{
        type:Number, 
        default:0
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    }

});
productSchema.virtual('id').get(function(){
    return this._id.toHexString();

});
productSchema.set('toJSON' ,{
    virtual:true

});
exports.Product = mongoose.model('Product' ,productSchema );
exports.productSchema = productSchema;

