const express = require('express')

const router = express.Router()

const { authMiddleware } = require('../middleware/authMiddleware')
const { createTeam, joinTeam } = require('../controllers/teamsController')


router.post('/:id',authMiddleware,  createTeam)

router.post('/:teamId/join',authMiddleware,  joinTeam)

module.exports = router