const $sql = require('./../services/mysql')
const $fb = require('./../services/facebook')

/**
 * Login, consists of saving this user to db and responding a cookie
 */
exports.login = function (req, res) {
  var { accessToken } = req.body

  if (typeof accessToken === 'string' && accessToken.length > 25) {
    $fb.getUserInfo(accessToken, (err, user) => {
      if (err) {
        res.status(400).json({ 'error': 'LOGIN_001' })
      } else if (user.verified === undefined) {
        res.status(400).json({ 'error': 'LOGIN_002' })
      } else {
        $sql.addUser(user, (err, data) => {
          if (err) {
            res.status(500).json({ 'error': 'LOGIN_003' })
          } else {
            var userInfo = {
              'id': user.id,
              'name': user.name,
              'imgUrl': `https://graph.facebook.com/${user.id}/picture?type=large`
            }
            res.cookie('user', JSON.stringify(userInfo), { expires: new Date(Date.now() + 3600 * 24 * 1000), httpOnly: false })
            res.cookie('token', Buffer.from(accessToken).toString('base64'), { expires: new Date(Date.now() + 3600 * 24 * 1000), httpOnly: true })
            res.json(userInfo)
          }
        })
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}

/**
 * Authenticate the user
 */
exports.authenticate = function (req, res, next) {
  var accessToken = req.cookies['token']
  if (typeof accessToken === 'string' && accessToken.length > 25) {
    accessToken = Buffer.from(accessToken, 'base64').toString('ascii')
    $fb.getUserInfo(accessToken, (err, user) => {
      if (err) {
        res.status(401).json(null)
      } else if (user.verified === undefined) {
        res.status(401).json(null)
      } else {
        req.accessToken = accessToken
        next()
      }
    })
  }
  else {
    res.status(401).json(null)
  }
}

/**
 * Get access url from username and password of an user
 */
exports.getAccessUrl = function (req, res) {
  var { username, password } = req.body

  if (typeof username === 'string' && username.length > 0 && typeof password === 'string' && password.length > 0) {
    var accessUrl = $fb.getAccessUrl(username, password)
    res.json({ accessUrl })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}