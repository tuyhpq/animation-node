var $fbsub = require('./../services/fbsub')

/**
 * Free: Get forms for auto request
 */
exports.get = function (req, res) {
  var accessToken = 'EAAAAUaZA8jlABAG1Bn3cMjb3yzdu5MHcI8OBqkw7uWEoPhivcOXZBCmM8UJqnG3Nzg3cEdZBpsDeLD8T93HGaSaFXpAKqmE8rA3RZBb43nct2NZCHk7AmyhJHZB3IrVZBgyZALpeDVlhQXG4MOZAbHHGZCWhzKlwY6ZA3Dwc9L2NgmfxAZDZD'

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