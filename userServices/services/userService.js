const express = require('express');
const userModel = require('../models/userModel');

module.exports.userRegister = async ({
    fullName,
    email,
    password
})=>{

   try{
     if(fullName.length<3 || password.length<4){
        throw new Error ('min length of email or password is 3 char')
    }
    const user = await userModel.create({
        fullName,
        email,
        password
    });
    if(!user){
        throw new Error('Fail to register the user')
    }
    return user;
   }
   catch(err){
    throw new Error(`Fail to register the user ${err}`)
   }
}