// routes/documentRequests.js
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth');
const {
  createRequest,
  getRequestsForOwner,
   acceptRequest,
   declineRequest,
} = require('../controllers/documentRequestsController');

router.post('/requestCollaborator/:documentID', userAuth, createRequest);
router.get('/requests', userAuth, getRequestsForOwner);

// TODO: Uncomment when implemented in controller
 router.post('/requests/:requestId/accept', userAuth, acceptRequest);
 router.post('/requests/:requestId/decline', userAuth, declineRequest);

module.exports = router;
