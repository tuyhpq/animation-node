var $fbsub = require('./../services/fbsub')

/**
 * Free: Get forms for auto request
 */
exports.get = function (req, res) {
  var accessToken = 'EAAAAUaZA8jlABAFdewdbBhW1gr79YCF5G8Nv0s7Wufm7m93H3ib7mMR7cgPPpvBEpD1hIC0E0IgGdmy0e56mVgvbqZBGrdVH1tbpJX9LvyFSgksJAMcFcTMIfVnQIMvRoaDoLJs6L1RZAbEgd6PFCzWuSXdhKIrSOYIgiPqMAZDZD'

  $fbsub.autoLike.get(accessToken, (err, data) => {
    if (err) {
      res.status(400).json({ 'error': 'GET_FREELIKE_001', 'message': err.message })
    } else {
      res.json(data)
    }
  })
}

/**
 * Perform free like
 */
exports.submit = function (req, res) {
  var { cookie, id, limit, captcha } = req.body

  if (typeof cookie === 'string' && cookie.length > 0 && typeof id === 'string' && id.length > 0 &&
    typeof limit === 'string' && limit.length > 0 && typeof captcha === 'string' && captcha.length > 0) {
    $fbsub.autoLike.submit(cookie, id, limit, captcha, (err, data) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_FREELIKE_001', 'message': err.message })
      } else {
        res.json(null)
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}