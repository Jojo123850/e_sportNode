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
