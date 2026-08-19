const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const validator = require('validator')
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '364d'

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

// US1
const register = async (req, res) => {
    try {
        const {email, password, role} = req.body

        if( !email || !password){
            return res.status(400).json({ message: 'Please provide  email and password'})
        }

        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }) // Return soit true soit false

        if(!isPasswordOk){
            return res.status(400).json({ message: 'Password must have 1 lower, 1 upper, 1 number and 1 symbol and must be at least 6 characters long'})
        }

        // Vérifier si c'est un mail
        const isEmailOk = validator.isEmail(email)

        if(!isEmailOk){
            return res.status(400).json({ message: 'You must provide a valid email'})
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({
            where:{ email }
        })
        
        if(existingUser){
            return res.status(400).json({ message: 'Email already in use' })
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await User.create({
            email,
            password: hashedPassword,
            role
    
        })

        const token = generateToken(user.id)

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message})
    }
}

// @desc    Login user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {const register = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' })
        }

        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })

        if (!isPasswordOk) {
            return res.status(400).json({ message: 'Password must have 1 lower, 1 upper, 1 number and 1 symbol and must be at least 6 characters long' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'You must provide a valid email' })
        }

        const existingUser = await User.findOne({ where: { email } })

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedPassword
        })

        const token = generateToken(user.id)

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message })
    }
}
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({ message: 'Please provide email and password'})
        }

        const user = await User.findOne({
            where: {email} })
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        // Check password match
       const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const token = generateToken(user.id)

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email
                
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error during login', error: err.message})
    }
}

module.exports = { register, login }


