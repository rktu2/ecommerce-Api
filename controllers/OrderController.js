const {Order} = require('../models/Order');
const {OrderItem} = require('../models/OrderItme');


exports.createOrder = async (req, res) =>{
    const orderItemId = Promise.all(req.body.oredrItems.map(async orderItem =>{
        let neworderItem = new OrderItem({
            product: orderItem.product,
            quantity:orderItem.quantity,
        });
        neworderItem = await neworderItem.save();
        return neworderItem._id;
    }))
    const orderItemsresolved = await orderItemId;
    console.log(orderItemId);
    const totalprices = Promise.all(orderItemsresolved.map(async orderItemId =>{
        const orderItem = await OrderItem.findById(orderItemId).populate('price product');
        const totalprice = orderItem.product.price * orderItem.quantity;
        return totalprice;
    }));
    const totalprice =(await totalprices).reduce((a,b) => a+b ,0)

    let Order = await new Order({
        orderItems:orderItemsresolved,
        shippingaddress1:req.body.shippingaddress1,
        shippingaddress2:req.body.shippingaddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalprice:totalprice,
        user:req.body.user

    })
    Order = Order.save();
    if(Order){
        return res.status(200).json({success:true , data:Order , message:"order created successfully"})
    }
    return res.status(401).json({success:false  , message:"order not found"})

}

exports.listoforder = async (req, res) =>{
    const order = await Order.findById(req.params.id).populate('user', 'name')
    .populate({path:'ordeItem', populate:{
        path:'product' , populate:'category'
    }
});
if(order){
    return res.status(200).json({success:true ,data:order} )
}
return res.status(401).json({success:false ,message:"order not found"} )

}

exports.updatestatus = async (req, res) =>{
    try{
        let order = await Order.findByIdAndUpdate(req.params.id , {
            status:req.body.status

        });
        if(order){
            return res.status(200).json({success:true , message:"status updated" , data:order})
        }
        return res.status(401).json({success:false , message:"status not updated"})

    }catch(e){
        return res.status(500).json({success:false , message:e.message})
    
    }
}
exports.orderdeleted = async (req, res) =>{
    try{
        const order = await Order.findByIdAndDelete(req.params.id);
        if(order){
            return res.status(200).json({success:true , message:"order deleted"});
        }
        return res.status(401).json({success:false , message:"oredr not found"});
        
    }catch(e){
        return res.status(500).json({success:false , message:e.message});

    }
}
exports.totalsales = async (req, res)=>{
    try{
        const totalsales = await Order.aggregate([
            {
                $group :{_id:null ,$totalsales: {$sum: '$totalprice'}}
            }
        ])
        if(totalsales){
            return res.status(200).json({success:success , data:totalsales.pop().totalsales})
        }
        return res.status(401).json({success:false , message:"sales not present"});

    }catch(e){
        return res.status(500).json({success:false , message: e.message})
    }
}
exports.userorders = async (req, res) =>{
    try{
        const userorders = await Order.find({user:req.params.userid}).populate({
            path:'orderItems' , populate:{
                path:'product', populate:'category'
                }
            
        }).sort({'dateOrder': -1});
        if(userorders){
            return res.status(200).json({success:true , data:userorders});
        }
    }catch(e){
        return res.status(500).json({success:false , message:e.message});
    }
}