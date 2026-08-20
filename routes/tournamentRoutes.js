const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middleware/authMiddleware')

const { createTournament, updateTournament, deleteTournament,teamTournament, getOpenTournament, getTournamentTeam, getTournamentStat} = require('../controllers/tournamentController')

router.post('/', authMiddleware, createTournament)

router.put('/tournoi/:id', authMiddleware, updateTournament)


router.delete('/tournoi/delete/:id', authMiddleware, deleteTournament)

router.post('/:tournamentId/register/:teamId', authMiddleware, teamTournament)

router.get('/open', authMiddleware, getOpenTournament )

router.get('/:id/teams', authMiddleware, getTournamentTeam )

router.get('/stat/', authMiddleware, getTournamentStat)



module.exports = router