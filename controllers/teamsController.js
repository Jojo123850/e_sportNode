const User = require('../models/userModel')
const Team = require('../models/teamsModel')
const Member = require('../models/memberModel')


exports.createTeam = async (req, res) => {
    try {
        const { name, capacity } = req.body

        if (!name) {
            return res.status(400).json({ message: "Le nom de l'équipe est requis" })
        }

        
        const alreadyInTeam = await Member.findOne({
            where: { 
                userId: req.user.id 
            }
        })

        if (alreadyInTeam) {
            return res.status(400).json({ message: "Vous êtes déjà dans une équipe" })
        }

        const team = await Team.create({
            name,
            capacity,
            creatorId: req.user.id
        })

        await Member.create({
            userId: req.user.id,
            teamId: team.id
        })

        res.status(201).json({ message: "Équipe créée avec succès", team })

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Ce nom d'équipe est déjà pris" })
        }
        res.status(500).json({ message: error.message })
    }
}


exports.joinTeam = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.teamId)

        if (!team) {
            return res.status(404).json({ message: 'Equipe non trouvée' })
        }

        const alreadyInTeam = await Member.findOne({
            where: { userId: req.user.id }
        })

        if (alreadyInTeam) {
            return res.status(400).json({ message: "Vous êtes déjà dans une équipe" })
        }

        const nbreMember = await Member.count({
            where: { teamId: team.id }
        })

        if (nbreMember >= team.capacity) {
            return res.status(400).json({ message: "L'équipe est déjà pleine" })
        }

        const newMember = await Member.create({
            userId: req.user.id,
            teamId: team.id
        })

        res.json(newMember)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

// US7: ajouter membre
exports.addMember = async (req,res) => {
    try {
        const team = await Team.findByPk(req.params.teamId)

        if (!team) {
            return res.status(404).json({ message: 'Equipe non trouvée' })
        }


        if(Team.creatorId === req.user.id){
            return res.status(404).json({message: "Seul le capitaine peut ajouter un membre "})
        }

        const { userId } = req.params

        if(!userId){
            return res.status(404).json({message: "Il faut l'identifiant du membre "})
        }

        const userToAddTeam = await User.findOne({userId})
        if(!userToAddTeam){
            return res.status(404).json({message: 'Aucun utilisateur a été trouvé'})  
        }


        const alreadyInTeam = await Member.findOne({
            where: { userId }
        })

        if (alreadyInTeam) {
            return res.status(400).json({ message: "Cet utilisateur est déjà dans une équipe" })
        }

        const nbreMember = await Member.count({
            where: { teamId: team.id }
        })

        if (nbreMember >= team.capacity) {
            return res.status(400).json({ message: "L'équipe est déjà pleine" })
        }

        const newMember = await Member.create({
            userId,
            teamId: team.id
        })

        res.json(newMember)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

}

exports.removeMember = async (req, res) => {
    try {
       const user = await User.findByPk(req.params.userId)
        
       if(user === null){
            return res.status(400).json({ message: "Utilisateur non trouvé" })
        }

        const team = await Team.findByPk(req.params.teamId)
    
        if(Team.creatorId === req.user.id){
            return res.status(404).json({message: "Seul le capitaine peut supprimer un membre "})
        }

        await user.destroy()

        res.status(200).json({ message: "L'utilisateur a été supprimée" })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}