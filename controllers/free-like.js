const Stringify = require('querystring').stringify

const $handle = require('./../services/handle')
const $axios = require('./../services/axios.js')

/**
 * Perform free like
 */
exports.submit = function (rootReq, rootRes) {
  const URL = 'http://thoidaiso.org/post.php'
  var { id } = rootReq.body

  $axios.public.post(URL, Stringify({ 'id': id }))
    .then((res) => {
      var message = $handle.extractDataFromHtml(res.data, `">`, '<')
      if (!message) {
        console.log(res.data)
        res.status(500).json({ 'error': 'FREELIKE_001' })
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
      rootRes.status(500).json({ 'error': 'FREELIKE_002' })
    })
}