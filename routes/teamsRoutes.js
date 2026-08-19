const express = require('express')

const router = express.Router()

const { authMiddleware } = require('../middleware/authMiddleware')
const { createTeam, joinTeam, addMember } = require('../controllers/teamsController')


router.post('/:id',authMiddleware,  createTeam)

router.post('/:teamId/join',authMiddleware,  joinTeam)

router.post('/:teamId/add',authMiddleware,  addMember)

module.exports = router