const sql = require('./../services/mysql')
const $fb = require('./facebook')

/**
 * Login, consists of saving this user to db and responding a cookie
 */
exports.login = function (req, res) {
  var { accessToken } = req.body

  if (typeof accessToken === 'string') {
    $fb.getUserInfo(accessToken, (err, data) => {
      if (err) {
        res.status(400).json({ 'message': 'Lỗi máy chủ.' })
      } else if (typeof data.verified === 'undefined') {
        res.status(400).json({ 'message': 'Mã truy cập không khả dụng.' })
      } else {
        sql.addUser(data, (err, data) => {
          if (err) {
            res.status(400).json({ 'message': 'Lỗi sql.' })
          } else {
            res.cookie('taly', accessToken);
            res.json({ 'message': 'Đăng nhập thành công.' })
          }
        })
      }
    })
  }
  else {
    res.status(400).json({
      message: 'Vui lòng cung cấp mã truy cập hợp lệ.'
    })
  }
}

/**
 * Authenticate the user
 */
exports.authenticate = function (req, res) {
  var { accessToken } = req.cookie['taly']
  //
}

/**
 * Authenticate the user
 */
exports.getAccessUrl = function (req, res) {
  var { email, password } = req.body

  if (typeof email === 'string' && typeof password === 'string') {
    var accessUrl = $fb.getAccessUrl(email, password)
    res.json({
      'accessUrl': accessUrl
    })
  } else {
    res.status(400).json()
  }
}