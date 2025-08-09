const express = require('express');
const userModel = require('../models/userModel');
const {hashedPassword} = require('../utils/hashedPassword');
const { userRegister } = require('../services/userService');
const { generateToken } = require('../utils/generateToken');
const {comparedPassword} = require('../utils/hashedPassword');
const blackListToken = require('../models/blackListToken');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if(fullName.length<=3 || password.length<=4){
      return res.status(501).json({message:'min length of fullname would be 3 and password would be 4'})
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await hashedPassword(password);
    const user = await userRegister({
      fullName,
      email,
      password: passwordHash,
    });

    if (!user) {
      return res.status(500).json({ message: 'Failed to register user' });
    }

    const token = await generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: 'strict',
    });

    return res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (err) {
    console.error("Registration Error:", err); // Log the error
    return res.status(500).json({ message: 'Internal system error' });
  }
};

const loginUser = async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(500).json({message:'email or password is incorrect'})
    }
    const isPasswordMatch =await comparedPassword(password,user.password)
    if(!isPasswordMatch){
      return res.status(500).json({message:'email or Password is incorect'})
    }
    const token = await generateToken(user);
    if(!token){
      return res.status(501).json({message:'fail to login'})
    }
    res.cookie('token',token);
    res.status(200).json({message:'login successfully',user,token})
  }catch(err){
    return res.status(500).json({message:'email or password is incorrect'})
  }
}
const logoutUser = async(req,res)=>{
  try{
    const token = req.cookies.token;
  if(!token){
    return res.status(401).json({message:'unauthorize: token not found'});
  };
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  if(!decoded){
    return res.status(401).json({message:'Unauthorized: token invalid or expired'})
  }
  const user = await userModel.findById(decoded.id);
  if(!user){
    return res.status(404).json({message:"unauthorize: user not found"})
  }
  const BlackList = await blackListToken.create({
    token,
    user:user.id
  })
  if(!BlackList){
    return res.status(404).json({message:'fail to Blacklist the token'})
  };
  res.clearCookie('token')
  return res.status(200).json({message:'user logout successfully'})
  }catch(err){
    console.log(err);
    return res.status(404).json({message:'Error: fail to logout user'})
  }
}
const userProfile = async(req,res)=>{
  try{
    const user = req.user;
    if(!user){
      return res.status(401).json({message:'user not found'})
    }
    return res.status(200).json({message:'User Profile',user})
  }catch(err){
    console.log(err.message);
    return res.status(401).json({message:'user not found'})
  }
}

module.exports ={ registerUser, loginUser, logoutUser,userProfile}