const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser,userProfile} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth');
const User = require('../models/userModel');

router.post('/register',registerUser);
router.post('/login',loginUser)
router.post('/logout',logoutUser);
router.get('/profile',userAuth,userProfile);

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('_id name email'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/userRoutes.js (continuing)
router.post('/bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'ids must be an array' });
    }

    const users = await User.find({ _id: { $in: ids } }).select('_id name email');
    res.json(users);
  } catch (err) {
    console.error('Error in bulk fetch:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;

