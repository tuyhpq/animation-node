var $fbsub = require('./../services/fbsub')
var $vipfb = require('./../services/vipfb')

/**
 * Fbsub: Get forms for auto request
 */
exports.getFbsub = function (req, res) {
  $fbsub.autoRequest.get(req.accessToken, (err, data) => {
    if (err) {
      res.status(400).json({ 'error': 'GET_FBSUB_AUTOREQUEST_001', 'message': err.message })
    } else {
      res.json(data)
    }
  })
}

/**
 * Fbsub: Submit a form for auto request
 */
exports.submitFbsub = function (req, res) {
  var { cookie, id, limit, captcha } = req.body

  if (typeof cookie === 'string' && cookie.length > 0 && typeof id === 'string' && id.length > 0 &&
    typeof limit === 'string' && limit.length > 0 && typeof captcha === 'string' && captcha.length > 0) {
    $fbsub.autoRequest.submit(cookie, id, limit, captcha, (err, data) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_FBSUB_AUTOREQUEST_001', 'message': err.message })
      } else {
        res.json(null)
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}

/**
 * Vipfb: Get forms for auto request
 */
exports.getVipfb = function (req, res) {
  $vipfb.autoRequest.get(req.accessToken, (err, data) => {
    if (err) {
      res.status(400).json({ 'error': 'GET_VIPFB_AUTOREQUEST_001', 'message': err.message })
    } else {
      res.json(data)
    }
  })
}

/**
 * Vipfb: Submit a form for auto request
 */
exports.submitVipfb = function (req, res) {
  var { cookie, id, input, captcha } = req.body

  if (typeof cookie === 'string' && cookie.length > 0 && typeof id === 'string' && id.length > 0 &&
    typeof input === 'string' && input.length > 0 && typeof captcha === 'string' && captcha.length > 0) {
    $vipfb.autoRequest.submit(cookie, id, captcha, input, (err, data) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_VIPFB_AUTOREQUEST_001', 'message': err.message })
      } else {
        res.json(null)
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}