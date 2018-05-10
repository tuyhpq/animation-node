var express = require('express')
var router = express.Router()

var $facebook = require('./../controllers/facebook')
var $vipfb = require('./../services/vipfb')
var $freeLike = require('./../controllers/free-like')

router.post('/free-like', $freeLike.submit)

router.get('/', function (req, res) {
  var accessToken = 'EAAAAUaZA8jlABAOZAZBJR6h2vv6uOGoFlZA5CZCohK591km5sfRYFBwTHAuk3uZCzmcFORpD9R968ZAXDoxH0FA9q7IMijjPOgA2EctLPWyuvnuVr3rHn6ZA3sik29ZCZBbSxECzZAkwGYFg3bdakEbUgcoCfZA2dQ6Qwm3ZAx5ZASO8oTPAZDZD'
  var vipfb = $vipfb.getInterface(accessToken, (err, data) => {
    if (err) {
      res.send(err)
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
