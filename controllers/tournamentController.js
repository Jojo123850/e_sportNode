
const Tournament = require('../models/tournamentModel')
const Registered = require('../models/tourRegisteredModel')
const Team = require('../models/teamsModel')
const Member = require('../models/memberModel')

// US8
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
        
         const newTour = await Tournament.create({
            name,
            game,
            date,
            rules,
            organizerId: req.user.id
     
        })


        res.status(201).json(newTour)

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Ce nom de tournoi est déjà pris" })
        }
        res.status(500).json({ message: error.message })
    }
}

// US9
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

        // récuperer l'id de teams et l'ajouter dans tournoi
        const team = await Team.findByPk(req.params.teamId)

        if(!team){
            return res.status(403).json("Cette équipe existe pas !")

        }

        const tournament = await Tournament.findByPk(req.params.tournamentId)

        if(!tournament){
            return res.status(403).json("Ce tournoi existe pas")
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
