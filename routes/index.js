const express = require('express')

var router = express.Router()

var freeLike = require('./../controllers/free-like')
var contact = require('./../controllers/contact')
var auth = require('./../controllers/authentication')
var autoRequest = require('./../controllers/auto-request')
var autoLike = require('./../controllers/auto-like')

router.get('/', function (req, res) {
  res.send('Tác giả: Hứa Phú Quý')
})

// Free like
router.post('/free-like', freeLike.submit)

// Contact
router.post('/feedback', contact.feedback)

// Authentication
router.post('/login', auth.login)
router.post('/access-url', auth.getAccessUrl)

// Auto request
router.get('/auto-request', auth.authenticate, autoRequest.get)
router.post('/auto-request', auth.authenticate, autoRequest.submit)

// Auto like
router.get('/auto-like', auth.authenticate, autoLike.get)
router.post('/auto-like', auth.authenticate, autoLike.submit)

module.exports = router
