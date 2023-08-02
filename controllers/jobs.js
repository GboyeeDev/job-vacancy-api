


const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRquestError, NotFoundError} = require('../errors')

// Get 
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

// Get
const getJob = async (req, res) => {
    // this is to find which job exactly and which user exactly
    const { user: {userId}, params: { id: jobId }, } = req

    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    // If job doesnt doest the id
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId} `)
    }
    res.status(StatusCodes.OK).json({ job })
}

// Post
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}


// Patch
const updateJob = async (req, res) => {
    // this is to find which job exactly and which user exactly
    const { body: {company, position}, user: {userId}, params: { id: jobId }, } = req

    // to ensure that company and position are never empty
    if (company === '' || position === '') {
        throw new BadRquestError('Position and Company cannot be empty')
    }

    const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, req.body, {new:true, runValidators:true})
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId} `)
    }
    res.status(StatusCodes.OK).json({ job })

}

// Delete
const deleteJob = async (req, res) => {
    const { user: {userId}, params: { id: jobId }, } = req

    const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId} `)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
