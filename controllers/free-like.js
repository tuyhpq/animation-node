const Axios = require('axios')
const QueryString = require('querystring')
var $handle = require('./../services/handle')

var axios = Axios.create()

/**
 * Perform free like
 */
module.exports.submit = function (rootReq, rootRes) {
  const URL = 'http://thoidaiso.org/post.php'
  var { id } = rootReq.body

  axios.post(URL, QueryString.stringify({ 'id': id }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then((res) => {
      console.log(res.data)
      var message = $handle.extractDataFromHtml(res.data, `">`, '<')
      if (!message) {
        throw { 'message': 'Lỗi không xác định.' }
      }
      rootRes.json({
        'message': message,
        'url': URL,
        'name': 'id'
      })
    })
    .catch((err) => {
      rootRes.status(500).json({
        'message': err.message
      })
    })
}