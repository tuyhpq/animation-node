var $fbsub = require('./../services/fbsub')

/**
 * Allow everybody to contribute comments
 */
exports.feedback = function (req, res) {
  var { message } = req.body

  if (typeof message === 'string' && message.length > 0 && message.length <= 1000) {
    res.json({ 'message': message })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}