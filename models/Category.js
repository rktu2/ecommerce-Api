const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
   name:{
       type:String, 
       required:true
   },
   color:{
       type:String,
       default:''
   },
   icon:{
       type:String,
       default:''
   },
   image:String,
   default: ''

});
categorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});
categorySchema.set('toJSON',{
    virtual:true

});
exports.Category = mongoose.model('Category' , categorySchema);
exports.categorySchema = categorySchema;