var express = require('express')
var router = express.Router()

var $facebook = require('./../controllers/facebook')
var $fbsub = require('./../services/fbsub')
var $freeLike = require('./../controllers/free-like')

router.post('/free-like', $freeLike.submit)

router.get('/', function (req, res) {
  var accessToken = 'EAAAAUaZA8jlABAJrggZBPWwHq7SPjKQs5ZBrv2ZAu0ouJ7vtNEIPsmdrzHt3Vtwp99ckV6nip0kyiyM27Ywcv1IZACo8528fNWVFAFQHKuoPvm0iauW1m38SRUR2FaNHgr4Nu8xDVbwFqLHhnMf0Pfe7ZCjWjQrehJtX0ZBXgKvWttsO6aj3YVMguHqUUiyHGMZD'
  var fbsub = $fbsub.autoLiker.get(accessToken, (err, data) => {
    if (err) {
      res.send(err.message)
    } else {
      res.send(data)
    }
  })
})

router.get('/auto-request', function (req, res) {
  var { accessToken } = req.query
  var fbsub = $fbsub.autoRequest.get(accessToken, (err, data) => {
    if (err) {
      var resErr = {
        'message': err.message,
        'reload': err.reload
      }
      res.status(400).json(resErr)
    } else {
      res.json([data])
    }
  })
})

router.post('/auto-request', function (req, res) {
  var { cookie, id, limit, captcha } = req.body

  var fbsub = $fbsub.autoRequest.submit(cookie, id, limit, captcha, (err, data) => {
    if (err) {
      res.status(400).send(err.message)
    } else {
      res.send(data)
    }
  })
})

router.post('/auto-liker', function (req, res) {
  var { cookie, id, limit, captcha } = req.body

  var fbsub = $fbsub.autoLiker.submit(cookie, id, limit, captcha, (err, data) => {
    if (err) {
      res.status(400).send(err.message)
    } else {
      res.send(data)
    }
  })
})

router.post('/login', function (req, res) {
  var { username, password, accessToken } = req.body
  var info = {}

  if (accessToken) {

  }
  else if (username && password) {

  } else {
    res.status(400).json({
      message: 'Vui lòng cung cấp tài khoản, mật khẩu hoặc mã truy cập để đăng nhập.'
    })
  }


  res.cookie('taly', info.accessToken, { secure: true });
  res.json({
    message: 'Đăng nhập thành công.'
  })
})

router.get('/:username/:password', function (req, res) {
  res.send($facebook.getUrlAccess(req.params.username, req.params.password))
})

router.get('/auto-follow', function (req, res) {

})

module.exports = router
