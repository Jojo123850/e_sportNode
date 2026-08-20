const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middleware/authMiddleware')
const { createTeam, joinTeam, addMember, removeMember, deleteTeam, getDetailTeam} = require('../controllers/teamsController')

router.post('/', authMiddleware, createTeam)

router.post('/:teamId/join', authMiddleware, joinTeam)

router.post('/:teamId/members/:userId', authMiddleware, addMember)

router.delete('/:teamId/members/:userId', authMiddleware, removeMember)

router.delete('/delete/:teamId', authMiddleware,deleteTeam )

router.get('/:teamId', authMiddleware, getDetailTeam)

module.exports = router