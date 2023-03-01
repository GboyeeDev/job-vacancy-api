const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')



const register = async (req, res) => {
    // using the Mongoose validation here
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    //this is what I'm returning to frontend
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {

    const {email, password} = req.body

    // To ensure users provide login details
    if(!email || !password){
        throw new BadRequestError('Provide email and Password')
    }

    // To ensure users provide correct email and password
    const user = await User.findOne({email})

    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }


    //then (To check if password is correct with token)
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: { name: user.name }, token})




}


module.exports = {register, login}