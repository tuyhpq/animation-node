const $sql = require('./../services/mysql')
const $fb = require('./facebook')

/**
 * Login, consists of saving this user to db and responding a cookie
 */
exports.login = function (req, res) {
  var { accessToken } = req.body

  if (typeof accessToken === 'string') {
    $fb.getUserInfo(accessToken, (err, data) => {
      if (err) {
        res.status(500).json({ 'error': 'LOGIN_002' })
      } else if (typeof data.verified === 'undefined') {
        res.status(400).json({ 'error': 'LOGIN_001' })
      } else {
        $sql.addUser(data, (err, data) => {
          if (err) {
            res.status(500).json({ 'error': 'LOGIN_003' })
          } else {
            res.cookie('taly', Buffer.from(accessToken).toString('base64'), { expires: new Date(Date.now() + 3600 * 24 * 1000), httpOnly: true })
            res.json(null)
          }
        })
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'LOGIN_001' })
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