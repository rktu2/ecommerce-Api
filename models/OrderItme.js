const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
   product:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Product'
   },
   Quantity:{
       type:Number,
       default:00
   }

});

orderItemSchema.virtual('id').get(function(){
    return this._id.toHexString();

})
orderItemSchema.set('toJSON',{
    virtual:true
})