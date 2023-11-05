const verifyToken = require('../middlewares/verifyToken')
const Review = require('../models/Review')
const reviewController = require('express').Router()

// get all comments from post
reviewController.get('/:listingId', async (req, res) => {
    try {
        const reviews = await Review.find({ listing: req.params.listingId }).populate("author", '-password')

        return res.status(200).json(reviews)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// create a comment
reviewController.post('/', verifyToken, async (req, res) => {
    try {
        const createReview = await (await Review.create({ ...req.body, author: req.user.id }))
            .populate('author', '-password')

        return res.status(201).json(createReview)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = reviewController