const Axios = require('axios')
const QueryString = require('querystring')

var axios = Axios.create({
  maxRedirects: 0,
  validateStatus: function (status) {
    return status >= 200 && status < 303;
  },
  proxy: {
    "host": "113.161.68.146",
    "port": 8080
  }
})

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/**
 * 
 */
module.exports.fromThoiDaiSo = function (req, resRoot) {
  // axios.post('http://thoidaiso.org/post.php', QueryString.stringify({ id: '2004260029839498' }), )
  //   .then((res) => {
  //     console.log(res.data)
  //     resRoot.send(res.data)
  //   })
  //   .catch((err) => {
  //     console.log(err.message)
  //     resRoot.send(err)
  //   })

  axios.get('http://thoidaiso.org/tang-like-facebook-gia-re/')
    .then((res) => {
      debugger
      console.log('xxxxxxx')
      console.log(res.data)
      resRoot.send(res.data)
    })
    .catch((err) => {
      console.log('xxxxxxx2')
      console.log(err.message)
      resRoot.send(err)
    })

}