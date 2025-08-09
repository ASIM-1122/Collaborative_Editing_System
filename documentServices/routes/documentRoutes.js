const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { createDocument, deleteDocument, addCollaborator, updateDocument } = require('../controllers/documentController');
const router = express.Router();

router.post('/create',userAuth,createDocument);

router.post('/addCollaborator/:documentID',userAuth,addCollaborator);

router.put('/updateDocument/:documentID',userAuth,updateDocument)

router.delete('/delete/:id',userAuth,deleteDocument);

module.exports = router
