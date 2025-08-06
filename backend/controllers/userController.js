const User = require("../models/userModel");

const registerUser = async (req,res) =>{
    const { firstName, lastName, emailId, password} = req.body;

    //VALIDATION

    if (!firstName || !emailId || !password){
        return res.status(400).send({message:"Please Add all mandatory fields"});
    }

    //Check the user existing already in db or not
    const userExists = await User.findOne({emailId});
    if (userExists){
       return res.status(400).json({message: "Already Exist"});
    }

    //CREATE USER IN YOUR DATABASE

    const newUser = await User.create({
        firstName,
        lastName,
        emailId,
        password
    });

    await newUser.save();
    
    return res.status(201).json("USER CREATED",{newUser});
    
}


// const loginUser = () => {

// }

module.exports = { registerUser }