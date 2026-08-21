const express = require('express')
require('dotenv').config()
const { connectDB, sequelize } = require('./config/db')
const app = express()
const port = process.env.PORT || 3001
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon API RESTful !')
})
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const teamsRoutes = require('./routes/teamsRoutes')
const tournamentRoutes = require('./routes/tournamentRoutes')
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/team', teamsRoutes)
app.use('/api/v1/tournament', tournamentRoutes)

async function start() {
    await connectDB()
    await sequelize.sync()
    app.listen(port, () => {
        console.log(`Serveur lancé sur le port ${port}`)
    })
}
start()
