const express = require('express')

var router = express.Router()

var freeLike = require('./../controllers/free-like')
var contact = require('./../controllers/contact')
var auth = require('./../controllers/authentication')
var autoRequest = require('./../controllers/auto-request')
var autoLike = require('./../controllers/auto-like')

// Ping api
router.get('/', (req, res) => { res.json({ 'message': 'Welcome to FBVN' }) })

// Free like
router.post('/free-like', freeLike.submit)

// Contact
router.post('/feedback', contact.feedback)

// Authentication
router.post('/login', auth.login)
router.post('/access-url', auth.getAccessUrl)

// Auto request
router.get('/auto-request/1', auth.authenticate, autoRequest.getFbsub)
router.post('/auto-request/1', auth.authenticate, autoRequest.submitFbsub)

// Auto like
router.get('/auto-like/1', auth.authenticate, autoLike.getFbsub)
router.post('/auto-like/1', auth.authenticate, autoLike.submitFbsub)

module.exports = router
