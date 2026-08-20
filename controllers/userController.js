const User = require('../models/userModel')
const { sequelize } = require('../config/db')


// US4 - Modifier mon profil
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        const { email, password } = req.body

        console.log(req.body)
        const updateProfile= await user.save()
        res.json(user)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// US16: Modifier le role
exports.updateRole = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin'

        if (!isAdmin) {
            return res.status(403).json({ message: "Seul l'administrateur peut modifier le rôle" })
        }

        const user = await User.findByPk(req.params.userId)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        const { role } = req.body

        const validRoles = ['joueur', 'capitaine', 'organisateur', 'admin']
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' })
        }

        user.role = role
        await user.save()

        res.status(200).json({ message: 'Rôle mis à jour', user: { id: user.id, role: user.role } })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}