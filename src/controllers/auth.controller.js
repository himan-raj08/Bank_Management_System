const userModel =require("../models/User.mdel")
const accountModel = require("../models/account.model");
 const jwt =require("jsonwebtoken")
 const emailService =require("../services/email.services")




async  function userRegisterController(req, res){


   

    const { email, password, name } = req.body;

    // console.log("email =", email);
    // console.log("name =", name);
    // console.log("password =", password);  
  

  const isExists =await userModel.findOne({
     email:email
  })

   if(isExists){
     return res.status(422).json({
         message: "User already Exists",
          status: "failed"
     })
    }

      const user =await userModel.create({
         email, password, name
         
      })

       const token =jwt.sign({
         userId:user._id
       },process.env.JWT_SECRET,{
        expiresIn:"7d"
       })
        res.cookie("token",token)


                 //     await emailService.sendRegistrationEmail(user.email, user.name)

         res.status(201).json({
             user:{
                _id:user._id,
                 email:user.email,
                  name:user.name
             },
             token
         })

       //  await emailService.sendRegistrationEmail(user.email, user.name);

   
 }

 async function userLoginController(req ,res) {
     const {email, password} =req.body
   
    
      const user =await userModel.findOne({
        email
      }).select("+password")
       if(!user){
         return res.status(401).json({
             message: "Email or Password is Required"
         })
       }
      const isValidPassword=await user.comparePassword(password)

       if(!isValidPassword){
        return res.status(401).json({
           message: "Email or Password is INVALID"
        })
        }
         const token =jwt.sign({
         userId:user._id
       },process.env.JWT_SECRET,{
        expiresIn:"7d"
       })
        res.cookie("token",token)

         res.status(200).json({
             user:{
                _is:user._id,
                 email:user.email,
                  name:user.name
             },
             message:"Logged In SuccessFully",
             token
         })
       
 }

 async function LogOut(req, res) {
  try{
  res.clearCookie("token");
  return res.status(201).json({
    success:true,
    message: "LoggedOut Successfully"
  })
  }
  catch(error){

    console.log(error);

    res.status(500).json({
      message:"Internal Server Error"
    });

  }
};
async function getMe(req, res) {
  try{
    return res.status(200).json({
      success:true,
      user:req.user
    });
  }
  catch(error){

    res.status(500).json({
      message:"Internal Server Error"
    });

  }
  
}
  module.exports ={userRegisterController,userLoginController,LogOut,getMe}