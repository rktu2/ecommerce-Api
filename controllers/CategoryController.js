const e = require('express');
const {Category} = require('../models/Category');

exports.AddCategory = async(req, res) =>{
    try{
       let categories =  await new Category({
           name:req.body.name,
           color:req.body.color,
           icon:req.body.icon,
           image:req.body.image,

       })

       categories = categories.save();
           if(categories){
               return res.status(200).json({success:true , message:"category successfully store" , data:categories})
           }
           return res.status(401).json({success:false , message:"category not found"})
    }catch(e){
        return res.status(500).json({success:false , message:e.message})


    }
}
exports.getcategory = async (req, res) =>{
    try{
        const category = await Category.find();
        if(category){
            return res.status(200).json({status:true , data:category});
        }
        return res.status(401).json({status:false , message: 'category not found'});


    }catch(e){
        return res.status(500).json({status:false , message: e.message});


    }
}
exports.deletecategory = async (req, res) =>{
    try{
    const category = await Category.findByIdAndDelete(req.params.id);
    if(category){
        return res.status(200).json({success:true , data:category})
    }
    return res.status(401).json({success:false , message:"category not found"});

    }catch(e){
    return res.status(500).json({success:false , message:e.message});
        
    }
}

exports.updatecategory = async (req, res) =>{
    try{
        const category = await Category.findByIdAndUpdate(req.params.id, {

            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon,
            image:req.body.image, 
        });
        console.log(category);
        if(!category){
            return res.status(401).json({success:false , message:"category not found" })
        }
        return res.status(200).json({success:true , message:"category Update Successfully" , data:category })


    }catch(e){
        return res.status(500).json({success:false , message:e.message })


    }

}

exports.singlecategory = async (req, res) =>{
    try{
        const category = await Category.findById(req.params.id);
        console.log(category)
        if(!category){
            return res.status(401).json({success:false , message:"category not found"})
        }
        return res.status(200).json({success:true , message:"category found successfully", data:category})


    }catch{
        return res.status(500).json({success:false , message:e.message})


    }
}