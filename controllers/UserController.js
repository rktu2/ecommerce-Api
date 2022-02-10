const  {User} = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { count } = require('console');


exports.getuser = async (req, res) => {
    console.log("hello world")

  try{
      const users = await User.findOne({
          where:{
              id:req.params.id
          }
      });
      console.log(users);
      if(!users){
        return res.status(200).json({success:false , message:'user not found'})
          
      }
      return res.status(200).json({success:true , message:'User Found Successfully'})

  }
  catch(e){
      return res.status(500).json({success:false , message:e.message})

  }

}

// register users
exports.RegisterUser = async (req, res) =>{
    try{
    let users = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        street:req.body.street,
        country:req.body.country,
        appartment:req.body.appartment,
        city:req.body.city,
        zip:req.body.zip, 
        password:bcrypt.hashSync(req.body.password),
        isAdmin:req.body.isAdmin 
    })
    users = await users.save();
     console.log(users.password);
    if(!users){
        return res.status(200).json({success:false , message:"users not register"})
    }
    return res.status(200).json({success:true , message: "users successfully register", data:users})
}catch(e){
    return res.status(200).json({success:false, message:e.message});
}
}
//  get all user
exports.getUser = async (req, res) =>{

    try{
        const getuser = await User.find().select('-password');
        // console.log(getuser);
        if(!getuser){
            return res.status(200).json({success:false , message:"Users Not Found"})
        }
        return res.status(200).json({success:true , message:"users found ", data:getuser})

    }catch(e){
        return res.status(500).json({success:false , message:e.message})

    }
}
// get single user
exports.getSingleUser = async (req , res) =>{
    try{
        const singleUser = await User.findById(req.params.id).select('-password');
        console.log(singleUser);
        if(!singleUser){
            return res.status(200).json({status:false , message:"user not found"});
        }
        return res.status(200).json({status:true , message: "user found" , data:singleUser});
    }catch(e){
        return res.status(500).json({status:false , message: e.message});


    }
}

// login users

exports.loginUser = async (req , res) =>{
    const secret = process.env.secret
    try{
        const user = await User.findOne({email:req.body.email});
        //  console.log(user);
        if(!user){
            return res.status(400).send("user not found");
        }
        if(user && bcrypt.compareSync(req.body.password , user.password)){
            const token = jwt.sign(
                {
                    userId : user.id,
                    isAdmin:user.isAdmin
                },
                secret,
                {expiresIn:'1d'}
               
            )
            return res.status(200).json({success:true ,user:user.email , token:token})
        }else{
            return res.status(400).send("password is wrong")
        }
    }catch(e){
        return res.status(500).json({status:false , message:e.message})

    }
}
//  count total user
exports.UserList = async (req, res) =>{
    try{
        const userlist = await User.countDocuments();
        console.log(userlist);
        if(!userlist){
            return res.status(401).json({success:false , message: "user not found"})
        }
        return res.status(200).json({success:true , message: "List of Users" , data:userlist})

    }catch(e){
        return  res.status(500).json({success:false ,message:e.message })
    }
   
}

//  remove user by id
exports.removeuser =  async (req, res) =>{
   await User.findByIdAndRemove(req.params.id).then(user =>{
        if(!user){
            return res.status(401).json({success:false , message:"User Not Found"})
        }
        return res.status(200).json({success:true , message:"User Found" , data:user});

    })
}
    




