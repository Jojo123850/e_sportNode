const Tournament = require('../models/tournamentModel')
const Registered = require('../models/tourRegisteredModel')
const Team = require('../models/teamsModel')
const Member = require('../models/memberModel')

// US8:: Créer un tournoi
exports.createTournament = async (req, res) => {
    try {
        const { name, game, date, rules } = req.body

        if (!name || !game || !date || !rules) {
            return res.status(400).json({ message: "Le nom du tournoi  est requis" })
        }

        const isOwner = req.user.role === 'organisateur'

        if(!isOwner){
            return res.status(403).json({ message: "Seul l'organisateur peut créer un tournoi" })
        }
        
        const newTour = await Tournament.create({name,game,date,rules,organizerId: req.user.id})
        res.status(201).json(newTour)

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Ce nom de tournoi est déjà pris" })
        }
        res.status(500).json({ message: error.message })
    }
}

// US9:Modifier un tournoi
exports.updateTournament = async (req, res) => {
    try {
          const tournament = await Tournament.findByPk(req.params.id)

        if (!tournament) {
            return res.status(404).json({ message: 'Tournoi non trouvé' })
        }

        const isOwner = tournament.organizerId === req.user.id

        if(!isOwner){
            return res.status(403).json({ message: "Seul l'organisateur peut modifier un tournoi" })
        }

        const { name, game, date, rules } = req.body

        if(name){
            tournament.name = name
        }
         if(game){
            tournament.game = game
        }
        if(date){
            tournament.date = date
        }
        if(rules){
            tournament.rules = rules
        }

        await tournament.save()


        console.log(req.body)
        res.json(tournament)

    } catch (error) {
        res.status(500).json({ message: error.message })
        
    }
}


// US10 :supprimer un tournoi
exports.deleteTournament = async (req, res) => {
    try {
         const tournament = await Tournament.findByPk(req.params.id)

         if(tournament === null){
            return res.status(404).json("Aucun tournoi trouvé")
         }

        const isCreator = tournament.organizerId === req.user.id
        const isAdmin = req.user.role === 'admin'

        if(!isCreator && !isAdmin){
            return res.status(403).json({ message: "Seul l'organisateur peut supprimer un tournoi" })
        }
        await tournament.destroy()
        res.json("Tournoi supprimer avec succès")

        
    } catch (error) {
         res.status(500).json({ message: error.message })
    }
}

// US11: inscrire une équipe au tournoi
exports.teamTournament = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.teamId)

        if(!team){
            return res.status(404).json("Cette équipe existe pas !")
        }

        const tournament = await Tournament.findByPk(req.params.tournamentId)

        if(!tournament){
            return res.status(404).json("Ce tournoi existe pas")
        }

        const isMember = await Member.findOne({
            where: { 
                userId: req.user.id ,
                teamId: team.id
            }
        })

        if (!isMember) {
            return res.status(400).json({ message: "Vous faites pas partie du team!!!!!" })
        }

        const isPlayer = req.user.role === 'joueur'
        const isCaptain = req.user.role === 'capitaine'

        if (!isPlayer && !isCaptain) {
            return res.status(403).json({ message: "Seul un joueur ou un capitaine peut inscrire une équipe" })
        }

        const alreadyRegistered = await Registered.findOne({
            where: {
                teamId: team.id,
                tournamentId: tournament.id
            }
        })

        if(alreadyRegistered){
            return res.status(403).json({message:"Cet équipe est déjà inscrit dans le tournoi "})
        }

        const touRegist = await Registered.create({
                teamId: team.id,
                tournamentId: tournament.id 
        })
    res.status(201).json("Vous etes officielement inscrit à ce tournoi") 
    } catch (error) {
          res.status(500).json({ message: error.message })
    }
}


// US12: Lister les tournois ouverts
exports.getOpenTournament = async (req, res) => {
    try {
        
        const tournament = await Tournament.findAll({
            where:
            {
                isOpen: true
            }
        })

        res.status(200).json(tournament)
        
    } catch (error) {
         res.status(500).json({ message: error.message })
    }
}

// US13:Voir les équipes inscrites aux tournoi
exports.getMyTournamentsTeams = async (req, res) => {
    try {
        const tournaments = await Tournament.findAll({
            where: { organizerId: req.user.id }
        })

        const registrations = await Registered.findAll()
        const teams = await Team.findAll()

        const result = tournaments.map(tournament => {
            const registeredTeamIds = registrations
                .filter(r => r.tournamentId === tournament.id)
                .map(r => r.teamId)

            const registeredTeams = teams.filter(t => registeredTeamIds.includes(t.id))

            return {
                id: tournament.id,
                name: tournament.name,
                game: tournament.game,
                teams: registeredTeams
            }
        })

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// US15: Voir les statistiques des participants
exports.getTournamentStat = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin'
        if (!isAdmin) {
            return res.status(403).json({ message: "Seul l'administrateur peut consulter ces statistiques" })
        }
        const tournament = await Tournament.findAll()
        const registration = await Registered.findAll()

        const stat = tournament.map(t => {
            const teamCount = registration.filter(r => r.tournamentId === t.id).length

            return {
                id: t.id,
                name: t.name,
                game: t.game,
                date: t.date,
                teamCount
            }
        })
        res.status(200).json(stat)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// US18: consulter mes inscriptions à des tournois
exports.getMyTournament = async (req, res) => {
    try {
        const memberRel = await Member.findOne({
            where: { userId: req.user.id }
        })

        if (!memberRel) {
            return res.status(404).json({ message: "Vous ne faites partie d'aucune équipe" })
        }

        const registration = await Registered.findAll({
            where: { teamId: memberRel.teamId }
        })

        const tournamentIds = registration.map(r => r.tournamentId)

        const tournament = await Tournament.findAll({
            where: { id: tournamentIds }
        })

        if (tournament.length === 0) {
            return res.status(200).json({ message: "Votre équipe n'est inscrite à aucun tournoi", tournaments: [] })
        }

        res.status(200).json({ tournaments: tournament })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}