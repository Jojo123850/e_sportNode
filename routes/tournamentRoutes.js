const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middleware/authMiddleware')

const { createTournament, updateTournament, deleteTournament } = require('../controllers/tournamentController')

router.post('/', authMiddleware, createTournament)

router.put('/tournoi/:id', authMiddleware, updateTournament)


router.delete('/tournoi/delete/:id', authMiddleware, deleteTournament)
module.exports = router