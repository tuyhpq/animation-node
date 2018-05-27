const express = require('express')

var router = express.Router()

var freeLike = require('./../controllers/free-like')
var contact = require('./../controllers/contact')
var auth = require('./../controllers/authentication')
var autoRequest = require('./../controllers/auto-request')
var autoLike = require('./../controllers/auto-like')
var profileGuard = require('./../controllers/profile-guard')

// Ping api
router.get('/', (req, res) => { res.json({ 'message': 'Welcome to FBVN' }) })

// Free like
router.get('/free-like', freeLike.get)
router.post('/free-like', freeLike.submit)

// Contact
router.post('/feedback', contact.feedback)

// Authentication
router.post('/login', auth.login)
router.post('/access-url', auth.getAccessUrl)

// Auto request
router.get('/auto-request/fbsub', auth.authenticate, autoRequest.getFbsub)
router.post('/auto-request/fbsub', auth.authenticate, autoRequest.submitFbsub)
router.get('/auto-request/vipfb', auth.authenticate, autoRequest.getVipfb)
router.post('/auto-request/vipfb', auth.authenticate, autoRequest.submitVipfb)

// Auto like
router.get('/auto-like/fbsub', auth.authenticate, autoLike.getFbsub)
router.post('/auto-like/fbsub', auth.authenticate, autoLike.submitFbsub)

// Turn on profile guard
router.post('/profile-guard', profileGuard.submit)

module.exports = router
