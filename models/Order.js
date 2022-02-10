const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
     orderItems:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'OrderItem',
         required:true
     },

    shippingaddress1:{
        type:String,
        required:true
    },
    shippingaddress2:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
   status:{
       type:String,
       required:true,
       default:'pending'
   },
   totalprice:{
       type:Number,
   },
   user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
   },
   dateOrder:{
       type:Date,
      default:Date.now() 
   }


});

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
orderSchema.set('toJSON',{
    virtual:true
});
exports.Order = mongoose.model('Order' , orderSchema);
exports.orderSchema = orderSchema;