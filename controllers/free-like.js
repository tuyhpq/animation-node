const Stringify = require('querystring').stringify

const $handle = require('./../services/handle')
const $axios = require('./../services/axios.js')

/**
 * Perform free like
 */
exports.submit = function (rootReq, rootRes) {
  const URL = 'https://thoidaiso.org/post.php'
  var { id } = rootReq.body

  if (typeof id === 'string' && id.length > 0 && id.length <= 500) {
    $axios.public.post(URL, Stringify({ 'id': id }))
      .then((res) => {
        var message = $handle.extractDataFromHtml(res.data, `>`, '<')
        if (!message) {
          logError('500_FREELIKE_001')
          console.log(res.data)
          res.status(500).json({ 'error': '500_FREELIKE_001' })
        }
        else {
          rootRes.json({
            'message': message,
            'url': URL,
            'name': 'id'
          })
        }
      })
      .catch((err) => {
        rootRes.status(500).json({ 'error': '500_FREELIKE_002' })
      })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}