const User = require('../models/userModel')
const Team = require('../models/teamsModel')
const Member = require('../models/memberModel')

// US5: Créer équipe
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

// US6: rejoindre une équipe
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

// US7A: ajouter membre
exports.addMember = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.teamId)

        if (!team) {
            return res.status(404).json({ message: 'Equipe non trouvée' })
        }

        if (team.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Seul le capitaine peut ajouter un membre" })
        }

        const { userId } = req.params

        const userToAddTeam = await User.findByPk(userId)
        if (!userToAddTeam) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' })
        }

        const alreadyInTeam = await Member.findOne({ 
            where: {
                 userId 
                }
         })
        if (alreadyInTeam) {
            return res.status(400).json({ message: "Cet utilisateur est déjà dans une équipe" })
        }

        const nbreMember = await Member.count({
             where: { 
                teamId: team.id 
            } 
        })

        if (nbreMember >= team.capacity) {
            return res.status(400).json({ message: "L'équipe est déjà pleine" })
        }

        const newMember = await Member.create({ userId, teamId: team.id })
        res.status(201).json(newMember)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// US7B:Retirer un joueur d'un équipe
exports.removeMember = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId)

        if (user === null) {
            return res.status(404).json({ message: "Utilisateur non trouvé" })
        }

        const team = await Team.findByPk(req.params.teamId)

        if (!team) {
            return res.status(404).json({ message: "Equipe non trouvée" })
        }

        if (team.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Seul le capitaine peut supprimer un membre" })
        }

        const deletedMember = await Member.destroy({
            where: {
                userId: req.params.userId,
                teamId: req.params.teamId
            }
        })

        if (deletedMember == 0) {
            return res.status(404).json({ message: "Ce membre n'est pas dans votre équipe" })
        }

        res.status(200).json({ message: "L'utilisateur a été retiré de l'équipe" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// US14: Supprimer une équipe
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.teamId)

        if(!team){
            return res.status(404).json({ message: "Cet équipe existe pas" })
        }

        const isAdmin = req.user.role === 'admin'

        if(!isAdmin){
            return res.status(403).json({ message: "Seul l'administrateur peut supprimer une équipe" })
        }

        await team.destroy()

        res.status(200).json({ message: "L'équipe a été supprimée" })
        
    } catch (error) {
         res.status(500).json({ message: error.message })
    }
}

// US17 : consulter les informations d'une équipe
exports.getDetailTeam = async (req,res) => {
    try {
        const team = await Team.findByPk(req.params.teamId)

        if(!team){
            return res.status(404).json({ message: "Cet équipe existe pas" })
        }

        const members = await Member.findAll({
            where: 
                {
                 teamId: team.id
                }
        })

        const allUser = members.map ( m => m.userId)

        const user = await User.findAll({
            where: {
                id: allUser,
            }, attributes: ['id', 'email', 'role']
        })

        res.status(200).json({
            id: team.id,
            name: team.name,
            capacity: team.capacity,
            creatorId: team.creatorId,
            members: user
        })

    } catch (error) {
         res.status(500).json({ message: error.message })
    }
}