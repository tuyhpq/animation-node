const Axios = require('axios')
const QueryString = require('querystring')
var $handle = require('./../services/handle')

var axios = Axios.create()
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/**
 * 
 */
module.exports.fromAbclike = function (rootReq, rootRes) {
  var { id } = rootReq.body

  axios.post('https://abclike.xyz/post.php', QueryString.stringify({ 'id': id }), { headers: { 'x-requested-with': 'XMLHttpRequest' } })
    .then((res) => {
      var message = $handle.extractDataFromHtml(res.data, `alert("`, '")')
      if (!message) {
        throw {
          message: 'Lỗi không xác định.'
        }
      }
      rootRes.json({
        message: message
      })
    })
    .catch((err) => {
      rootRes.status(500).json({
        message: err.message
      })
    })
}