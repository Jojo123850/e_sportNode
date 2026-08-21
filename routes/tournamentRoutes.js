const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middleware/authMiddleware')

const { createTournament, updateTournament, deleteTournament,teamTournament, getOpenTournament, getMyTournamentsTeams, getTournamentStat, getMyTournament} = require('../controllers/tournamentController')

router.post('/', authMiddleware, createTournament)

router.put('/:id', authMiddleware, updateTournament)


router.delete('/delete/:id', authMiddleware, deleteTournament)

router.post('/:tournamentId/register/:teamId', authMiddleware, teamTournament)

router.get('/open', authMiddleware, getOpenTournament )

router.get('/mine/teams', authMiddleware, getMyTournamentsTeams)

router.get('/stat/', authMiddleware, getTournamentStat)

router.get('/mine', authMiddleware, getMyTournament)

module.exports = router