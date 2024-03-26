const asyncHandler=require("express-async-handler")

const express=require("express")

const router=express.Router()
const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const validateToken = require("../middleware/validateTokenHandler")


// <<------------@@ 1. Register the User @@ ------------>>

//@desc Register a user
//@route POST /api/users/register
//@access public
router.post("/register",asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
    //HASHING PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${user}`);
    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data us not valid");
    }
    res.json({ message: "Register the user" });
  }))


// <<------------@@ 2. Login the User @@ ------------>>

//@desc Login user
//@route POST /api/users/login
//@access public
router.post("/login",asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const user=await User.findOne({email})

    //COMPARE PASSWORD AND HASHED PASSWORD
    if(user && (await bcrypt.compare(password, user.password))){
        // ACCESS TOKEN
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            }
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"})

        res.status(200).json({accessToken})
    }
    else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
}))


// <<------------@@ 3. Current User Information @@ ------------>>

//@desc Current user info
//@route POST /api/users/current
//@access private
router.get("/current",validateToken,asyncHandler(async (req, res) => {
    res.json(req.user);
  }));
module.exports=router