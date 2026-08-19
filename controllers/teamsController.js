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

        const alreadyInTeam = await Member.findOne({
            where: { userId: req.user.id }
        })

        
    } catch (error) {
        
    }

}