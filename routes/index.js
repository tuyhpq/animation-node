var express = require('express')
var router = express.Router()

var $facebook = require('./../controllers/facebook')

router.get('/', function (req, res, next) {
  res.send('Vui lòng nhập tài khoản và mật khẩu!')
})

router.get('/:username/:password', function (req, res, next) {
  res.send($facebook.getUrlAccess(req.params.username, req.params.params))
})

module.exports = router
