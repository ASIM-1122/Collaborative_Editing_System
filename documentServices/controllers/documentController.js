const express = require('express');
const mongoose = require('mongoose')
const documentModel = require('../models/documentModel');

const createDocument  = async(req, res)=>{
    try{
        const {title,content,isPublic} = req.body;
        const user = req.user;
        const owner = user.id || user._id;
        const ownerEmail = user.email || user.email;


        const newDocument = await documentModel.create({
            title,
            content,
            owner,
            isPublic
        });
        if(!newDocument){
            return res.status(500).json({message:'fail to generate'})
        }
        newDocument.save();
        return res.status(201).json({message:'Document created Successfully',newDocument,ownerEmail})

    }
    catch(err){
        console.log(err.message);
        return res.status(500).json({message:'fail to generate the document'})
    }
}

const addCollaborator = async (req, res) => {
  try {
    const { newCollaborativeID } = req.body;
    const { documentID } = req.params;
    const userID = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(documentID) || !mongoose.Types.ObjectId.isValid(newCollaborativeID)) {
      return res.status(400).json({ message: 'Invalid document or user ID' });
    }

    const existingDocument = await documentModel.findById(documentID);
    if (!existingDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check ownership
    if (userID !== existingDocument.owner.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only owner can add collaborators' });
    }

    // Check if already added
    if (existingDocument.collaborators.includes(newCollaborativeID)) {
      return res.status(409).json({ message: 'Collaborator already added' });
    }

    // Add collaborator
    existingDocument.collaborators.push(newCollaborativeID);
    await existingDocument.save();

    return res.status(200).json({
      message: 'Collaborator added successfully',
      document: existingDocument,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Failed to add collaborator' });
  }
};


const updateDocument = async (req, res) => {
  try {
    const { documentID } = req.params;
    const { title, content } = req.body; // ⬅️ Get updated content
    const userID = req.user.id;

    // Validate document existence
    const isExistDocument = await documentModel.findById(documentID);
    if (!isExistDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is owner or a collaborator
    const isOwner = isExistDocument.owner.toString() === userID;
    const isCollaborator = isExistDocument.collaborators.includes(userID);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Only owner or collaborator can edit this document' });
    }

    // Update title and content
    if (title !== undefined) isExistDocument.title = title;
    if (content !== undefined) isExistDocument.content = content;

    await isExistDocument.save();

    return res.status(200).json({
      message: 'Document updated successfully',
      document: isExistDocument
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Failed to update the document' });
  }
};


const deleteDocument = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = req.user;

        const isExistDocument = await documentModel.findById(id);
        if(!isExistDocument){
            return res.status(404).json({message:'Document not exist'})
        }
        if(isExistDocument.owner != user.id){
            return res.status(401).json({message:'unauthorized'})
        };
         await documentModel.findOneAndDelete(id);
        return res.status(200).json({message:'successfully deleted the document'});
    }catch(err){
        console.log(err.message);
        return res.status(401).json({message:'Error, fail to delete'})
    }
}

module.exports={createDocument,deleteDocument,updateDocument,addCollaborator}