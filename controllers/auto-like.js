var $fbsub = require('./../services/fbsub')

/**
 * Get forms for auto like
 */
exports.getFbsub = function (req, res) {
  var accessToken = req.accessToken
  var serverName = 'Máy chủ suFB (Quốc tế)'

  $fbsub.autoLike.get(accessToken, (err, data) => {
    if (err) {
      res.status(400).json({ 'error': 'GET_AUTOLIKE_001', 'message': err.message, serverName })
    } else {
      data.serverName = serverName
      res.json(data)
    }
  })
}

/**
 * Submit a form for auto like
 */
exports.submitFbsub = function (req, res) {
  var { cookie, id, limit, captcha } = req.body

  if (typeof cookie === 'string' && cookie.length > 0 && typeof id === 'string' && id.length > 0 &&
    typeof limit === 'string' && limit.length > 0 && typeof captcha === 'string' && captcha.length > 0) {
    $fbsub.autoLike.submit(cookie, id, limit, captcha, (err, data) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_FBSUB_AUTOLIKE_001', 'message': err.message })
      } else {
        res.json(null)
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}