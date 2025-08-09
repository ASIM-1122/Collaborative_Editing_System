const express = require('express');
const bcrpt = require('bcrypt');
const hashedPassword= async (password)=>{
    try{
    const salt = await bcrpt.genSalt(10);
    const hashpassword = await bcrpt.hash(password,salt);
    return hashpassword;
    }
    catch(err){
        console.log(err);
        throw new Error('fail to hash the password');
    }
}


const comparedPassword = async(password,userPassword)=>{
    try{
        const isMatch = await bcrpt.compare(password,userPassword);
        return isMatch;
    }
    catch(err){
        throw new Error("invalid email or password")
    }
}
module.exports= {hashedPassword,comparedPassword};
