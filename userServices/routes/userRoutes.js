const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser,userProfile} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth')

router.post('/register',registerUser);
router.post('/login',loginUser)
router.post('/logout',logoutUser);
router.get('/profile',userAuth,userProfile)
module.exports = router;

