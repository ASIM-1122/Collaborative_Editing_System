const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "unauthorize: token is missing" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "unauthorized: user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    return res
      .status(401)
      .json({ message: "unauthorize: invalid or expired token" });
  }
};
