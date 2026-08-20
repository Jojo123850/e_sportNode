# e-sport
C'est la partie backend d'une application dédiée à la gestion de
compétitions e-sport, un domaine en pleine expansion.

## Technologies utilisées
* **Node JS** 
* **Sequelize**
* **Validator**
* **Supabase**

## Installation
```bash
npm init -y — création du package.json
npm i express — framework serveur
npm install bcryptjs jsonwebtoken — hash de mots de passe + gestion des tokens JWT
npm install -g nodemon — installation globale de nodemon (relance auto du serveur)
npm install dotenv --save — gestion des variables d'environnement (.env)
npm install --save sequelize — ORM pour la base de données
npm install --save pg pg-hstore — driver PostgreSQL + support des types hstore pour Sequelize
npm i bcrypt — hashage des mots de passe
npm i validator — validation des données
```

## Lancer le projet
```bash
nodemon app.js
```

## Structure du projet
```
e_sportNode/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── teamsController.js
│   ├── tournamentController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── authModel.js
│   ├── memberModel.js
│   ├── teamsModel.js
│   ├── tournamentModel.js
│   ├── tourRegisteredModel.js
│   └── userModel.js
├── node_modules/
├── routes/
│   ├── authRoutes.js
│   ├── teamsRoutes.js
│   ├── tournamentRoutes.js
│   └── userRoutes.js
├── .env
├── .env.local
├── .gitignore
├── app.js
└── package.json
```

## Auteur
Giovanie ANDRIANIRINA