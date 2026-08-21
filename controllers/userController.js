const User = require('../models/userModel')
const { sequelize } = require('../config/db')
const validator = require('validator')
const bcrypt = require('bcrypt')


// US4 - Modifier mon profil
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }
        const { email, password } = req.body
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'You must provide a valid email' })
            }
            const existingUser = await User.findOne({ where: { email } })
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Email already in use' })
            }
            user.email = email
        }
        if (password) {
            const isPasswordOk = validator.isStrongPassword(password, {
                minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
            })
            if (!isPasswordOk) {
                return res.status(400).json({ message: 'Password must have 1 lower, 1 upper, 1 number and 1 symbol and be at least 6 characters' })
            }
            user.password = await bcrypt.hash(password, 10)
        }
        await user.save()
        res.status(200).json({
            message: 'Profil mis à jour',
            user: { id: user.id, email: user.email, role: user.role }
        })
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