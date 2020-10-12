const router= require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation')

router.post('/register', async (req,res)=>{


    //LETS VALIDATE THE DATA BEFORE WE MAKE
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
   //checking whether the user exist in database or not
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');
    
    // hash the passwords

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

   //create user
    const user = new User({
      name: req.body.name,
       email: req.body.email,
       password: hashedPassword
   });
   try{
       const savedUser =await user.save();
       res.send(savedUser);
       
   }catch(err){
       res.status(400).send(err);
   }
});



router.post('/login',async (req, res)=>{

    //LETS VALIDATE THE DATA BEFORE WE MAKE
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
   //checking whether the email exist
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('email is not found');
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password) 
    if(!validPass) return res.status(400).send('Invalid password')
    
    //Create and assign token
    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token);

    

})

module.exports = router;