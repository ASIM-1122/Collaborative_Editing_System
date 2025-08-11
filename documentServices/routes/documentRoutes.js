const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const { createDocument, deleteDocument, addCollaborator, updateDocument,fetchUserDocuments,fetchAllDocuments,fetchDocumentById } = require('../controllers/documentController');
const router = express.Router();

router.post('/create',userAuth,createDocument);

router.get('/fetchUserDocuments',userAuth,fetchUserDocuments);

router.get('/fetchAllDocuments',fetchAllDocuments);

router.get('/fetchDocumentById/:id',userAuth,fetchDocumentById);

router.post('/addCollaborator/:documentID',userAuth,addCollaborator);

router.put('/updateDocument/:documentID',userAuth,updateDocument)

router.delete('/delete/:id',userAuth,deleteDocument);

module.exports = router
