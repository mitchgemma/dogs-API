// import our dependecies, middleware and models
const express = require('express')
const passport = require('passport')

// pull in our model
const Dogs = require('../models/dogs')

// helps us detect certain situations and send custom errors
const customErrors = require('../../lib/custom_errors')
// this function sends a 404 when non-existent document is requested
const handle404 = customErrors.handle404
// middleware that can send a 401 when a user tries to access something they do not own
const requireOwnership = customErrors.requireOwnership
// requireToken is passed as a second arg to router.<verb>
// makes it so that a token MUST be passed for that route to be available --> also sets 'req.user'
const requireToken = passport.authenticate('bearer', { session: false })
// this middleware removes any blank fields from req.body
const removeBlanks = require('../../lib/remove_blank_fields')

// instantiate our router
const router = express.Router()

// ROUTES GO HERE

//INDEX
// GET /dogs
router.get('/dogs', (req, res, next) => {
  Dogs.find()
    .then((dogs) => {
      return dogs.map((dog) => dog.toObject())
    })
    .then((dogs) => res.status(200).json({ dogs }))
    .catch(next)
})

// CREATE
// POST /dogs
router.post('/dogs', requireToken, (req, res, next) => {
  //   req.body.dog.owner = req.user.id

  Dogs.create(req.body.dogs)
    .then((dogs) => {
      res.status(201).json({ dogs: dogs.toObject() })
    })
    .catch(next)
})

// needed for testing
module.exports = router
