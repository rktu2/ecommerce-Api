const { Category } = require('../models/Category');
const { Product } = require('../models/Product');
const mongoose = require('mongoose');


exports.createproduct = async (req, res) =>{

    try{
        const category = await Category.findById(req.body.category);
        // console.log(category);
        if(!category){
            return res.status(401).json({succes:false , message:'Invalid category'})

        }
        let product = await new Product({
          name:req.body.name,
          description:req.body.description,
          richdescription:req.body.richdescription,
          image:req.body.image,
          images:req.body.images,
          brand:req.body.brand,
          price:req.body.price,
          category:req.body.category,
          countinstock:req.body.countinstock,
          rating:req.body.rating,
          isFeatured:req.body.isFeatured,
          dateCreated:req.body.dateCreated,
          numReview:req.body.numReview

        });
        product = product.save();
        console.log(product);
        if(!product){
            return res.status(401).json({success:false , message:"product not found"});
        }
        return res.status(200).json({success:true , message:"create product succesfully" , data:product});
    }catch(e){
        return res.status(500).json({success:false , message:e.message});


    }
}
exports.getproduct = async (req, res) =>{
    let filter = {};
    if(req.query.categories){
        filter = {category:req.queries.categories.split(' ')}
    }
    try{
        const product = await Product.find(filter).select('name brand description richdescription price category -_id');
        if(!product){
            return res.status(401).json({success:false , message:'product not found'})
        }
        return res.status(200).json({success:true , data:product , message:"list of product"});
    }catch(e){
        return res.status(500).json({success:false , message:e.message});
    }
}
// populate use for any another table details show
exports.singleproduct = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.id).populate('category');
        if(!product){
            return res.status(401).json({success:false , message:"product not found"});
        }
        return res.status(200).json({success:true , data:product , message:"Product Found"});
    }catch(e){
        return res.status(500).json({success:false , message:e.message});


    }
}
exports.updateproduct = async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(401).json({success:false , message:"invalid id"});
    }
    try{
        const category = await Category.findById(req.body.category);
        // console.log(category);
        if(!category){
            return res.status(401).json({succes:false , message:'Invalid category'});
        }
        const product = await Product.findByIdAndUpdate(req.params.id ,{
            name:req.body.name,
            description:req.body.description,
            richdescription:req.body.richdescription,
            image:req.body.image,
            images:req.body.images,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countinstock:req.body.countinstock,
            rating:req.body.rating,
            isFeatured:req.body.isFeatured,
            dateCreated:req.body.dateCreated,
            numReview:req.body.numReview

        },
        {new:true}
        );
        if(!product){
            return res.status(401).json({success:false , message:"product not found"})
        }
        return res.status(200).json({success:false , message:"product update sucessfully"})


    }catch(e){
        return res.status(500).json({success:false , message:e.message});
    }  
}

exports.deleteproduct = async (req, res) =>{
    try{
        const product = await Product.findByIdAndRemove(req.params.id);
        if(!product){
            return res.status(401).json({success:false , message:"product not found"})
        }
        return res.status(200).json({success:true , message:"product deleted"})
    }catch(e){
        return res.status(500).json({success:false , message:e.message});
    }
}
exports.featuredproduct = async (req, res) =>{
     const count = req.params.count?req.params.count:0
    try{
        const product = await Product.find({isFeatured:true}).limit(+count);
        if(!product){
            return res.status(401).json({success:false , message:"product not found"})
        }
        return res.status(200).json({success:true , message:"product  found" , data:product})
    }catch(e){
        return res.status(500).json({success:false , message:e.message})


    }
}

exports.countproduct = async (req, res) =>{
    try{
        const product = await Product.countDocuments();
        if(product){
            return res.status(200).json({success:true , message:"product count", data:product})
        }
        return res.status(401).json({success:false , message:"product not found"})

    }catch(e){
        return res.status(500).json({success:false , message:e.message})
    }
}