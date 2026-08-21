const express = require('express')
const router = express.Router()
const { updateProfile, updateRole} = require ('../controllers/userController')
const { authMiddleware } = require('../middleware/authMiddleware')


router.put('/profile',authMiddleware,  updateProfile )

router.put('/:userId/role', authMiddleware, updateRole)

module.exports = router