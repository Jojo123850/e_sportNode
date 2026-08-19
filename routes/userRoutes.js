const express = require('express')

const router = express.Router()
const { uptdateProfile, updateProfile} = require ('../controllers/userController')
const { authMiddleware } = require('../middleware/authMiddleware')


router.put('/profile',authMiddleware,  updateProfile )


module.exports = router