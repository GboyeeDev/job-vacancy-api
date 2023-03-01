// All the code here is for authentication access


const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticatedMiddle = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // if there is no authheader or authheader doesn't start with a bearer
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication Invalid')
    }

    // this create space after the bearer
    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // this down here attaches user to the job routes(we have 2 options and I prefer the 2nd option)

        // option 1
        //const user = User.findById(decoded.id).select('-password')
        //req.user = user

        // option 2
        req.user = { userId:decoded.userId, name:decoded.name }
        next()
    } catch (error) {
    throw UnauthenticatedError('Not Authorized')
    }

}


module.exports = authenticatedMiddle