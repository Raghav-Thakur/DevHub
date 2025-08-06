const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware")

const registerUser = async (req,res) =>{
    const { firstName, lastName, emailId, password} = req.body;

    if (!firstName || !emailId || !password){
        return res.status(400).send({message:"Please Add all mandatory fields"});
    }
    
    if (!validator.isEmail(emailId)) {
        return res.status(400).send({message:"Not a Valid email"});
    }

    if(!validator.isStrongPassword(password)) {
        return res.status(400).send({message:"Choose a Strong Password"})
    }
  
    const userExists = await User.findOne({emailId});
    if (userExists){
       return res.status(400).json({message: "Already Exist"});
    }

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
        firstName,
        lastName,
        emailId,
        password:passHash
    });

    await newUser.save();
    const token = auth.generateToken(newUser);
    
    return res.status(201).json({message:"User Created Successfully", token});   
}

const loginUser = async(req,res) => {
    const {emailId, password} = req.body;
    if (!emailId || !password) {
        return res.status(400).send({message:"Please Add all mandatory fields"});
    }
    const user1 = await User.findOne({emailId});
    if(!user1) {
        return res.status(400).send({message:"User not Found"});
    }
    const valid = await bcrypt.compare(password, user1.password);
    if(!valid) {
        return res.status(400).send({message:"Invalid Credentials"});
    }
    const token = auth.generateToken(user1);
    res.status(200).send({message:"Login Successfull", token});
}

module.exports = { registerUser, loginUser }