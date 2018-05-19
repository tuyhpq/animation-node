var $fbsub = require('./../services/fbsub')

/**
 * Get forms for auto like
 */
exports.get = function (req, res) {
  var accessToken = req.accessToken

  $fbsub.autoLike.get(accessToken, (err, data) => {
    if (err) {
      res.status(400).json({ 'error': 'GET_AUTOLIKE_001', 'message': err.message })
    } else {
      res.json([data])
    }
  })
}

/**
 * Submit a form for auto like
 */
exports.submit = function (req, res) {
  var { cookie, id, limit, captcha } = req.body

  if (typeof cookie === 'string' && cookie.length > 0 && typeof id === 'string' && id.length > 0 &&
    typeof limit === 'string' && limit.length > 0 && typeof captcha === 'string' && captcha.length > 0) {
    $fbsub.autoLike.submit(cookie, id, limit, captcha, (err, data) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_AUTOLIKE_001', 'message': err.message })
      } else {
        res.json(data)
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}