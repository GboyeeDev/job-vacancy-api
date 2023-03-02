require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


//connect DB
const connectDB = require('./db/connect')

//Authenticate User to access jobs router
const authMiddleware = require('./middleware/auth')

//routers
const authRouter = require('./routes/auth')
const JobsRouter = require('./routes/jobs')

//error handling
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddlware = require('./middleware/error-handler')


// extra security packages
app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // This is 15 minutes
        max: 100, // this limits each IP to 100 request per windowMs
    })
);
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())


// home page route
app.get('/', (req,res) => {
    res.set('Job Vacancy API')
})


//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleware, JobsRouter)

//middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddlware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listen to port ${port}..`))
    } catch (error) {
        console.log(error)
    }
}

start();
