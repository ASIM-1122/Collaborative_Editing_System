const CollaborationRequest = require('../models/CollaborationRequest');
const Document = require('../models/documentModel');
const mongoose = require('mongoose');
const axios = require('axios');
const { sendSocketToUser, sendSocketToRoom } = require('../utils/socketHelpers');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5000";

/**
 * Create a new collaboration request
 */
exports.createRequest = async (req, res) => {
  try {
    const { documentID } = req.params;
    const { message } = req.body;
    const requesterId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(documentID)) {
      return res.status(400).json({ message: 'Invalid document id' });
    }

    const doc = await Document.findById(documentID);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (doc.owner.toString() === requesterId) {
      return res.status(400).json({ message: "You can't request to collaborate on your own document" });
    }

    if (doc.collaborators?.includes(requesterId)) {
      return res.status(409).json({ message: 'You are already a collaborator' });
    }

    const existing = await CollaborationRequest.findOne({
      document: documentID,
      requester: requesterId,
      status: 'pending',
    });
    if (existing) return res.status(409).json({ message: 'Request already pending' });

    const request = await CollaborationRequest.create({
      document: documentID,
      requester: requesterId,
      owner: doc.owner,
      message,
    });

    const { data: requesterInfo } = await axios.get(`${USER_SERVICE_URL}/users/${requesterId}`);

    sendSocketToUser(doc.owner.toString(), 'collabRequestReceived', {
      requestId: request._id,
      document: { _id: doc._id, title: doc.title },
      requester: requesterInfo,
      message,
    });

    return res.status(201).json({ message: 'Request sent', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create request' });
  }
};

/**
 * Get all pending requests for owner
 */
exports.getRequestsForOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const requests = await CollaborationRequest.find({ owner: ownerId, status: 'pending' }).lean();

    if (!requests.length) {
      return res.status(200).json({ requests: [] });
    }

    const requesterIds = requests.map(r => r.requester.toString());
    const docIds = requests.map(r => r.document.toString());

    const [{ data: users }, docs] = await Promise.all([
      axios.post(`${USER_SERVICE_URL}/users/bulk`, { ids: requesterIds }),
      Document.find({ _id: { $in: docIds } }).lean()
    ]);

    const userMap = Object.fromEntries(users.map(u => [u._id, u]));
    const docMap = Object.fromEntries(docs.map(d => [d._id.toString(), d]));

    const enriched = requests.map(r => ({
      ...r,
      requester: userMap[r.requester.toString()],
      document: docMap[r.document.toString()],
    }));

    return res.status(200).json({ requests: enriched });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

/**
 * Accept a collaboration request
 */
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const ownerId = req.user.id;

    const request = await CollaborationRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.owner.toString() !== ownerId) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    // Add requester as collaborator
    await Document.findByIdAndUpdate(request.document, {
      $addToSet: { collaborators: request.requester },
    });

    request.status = "accepted";
    await request.save();

    sendSocketToUser(request.requester.toString(), "collabRequestAccepted", {
      documentId: request.document.toString(),
    });

    return res.json({ message: "Request accepted", request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to accept request" });
  }
};

/**
 * Decline a collaboration request
 */
exports.declineRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const ownerId = req.user.id;

    const request = await CollaborationRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.owner.toString() !== ownerId) {
      return res.status(403).json({ message: "Not authorized to decline this request" });
    }

    request.status = "declined";
    await request.save();

    sendSocketToUser(request.requester.toString(), "collabRequestDeclined", {
      documentId: request.document.toString(),
    });

    return res.json({ message: "Request declined", request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to decline request" });
  }
};
