const md5 = require('md5')
const $axios = require('./../services/axios.js')

/**
 * Get access url to get access token
 */
exports.getAccessUrl = function (email, password) {
  const API_SECRET = '62f8ce9f74b12f84c123cc23437a4a32'
  const data = {
    'api_key': '882a8490361da98702bf97a021ddc14d',
    'email': email,
    'format': 'JSON',
    'locale': 'vi_vn',
    'method': 'auth.login',
    'password': password,
    'return_ssl_resources': '0',
    'v': '1.0'
  }

  var sig = ''
  for (var key in data) {
    sig += key + '=' + data[key]
  }
  sig = md5(sig + API_SECRET)

  var url = `https://api.facebook.com/restserver.php`
  url += `?api_key=${data.api_key}&email=${data.email}&format=${data.format}&locale=${data.locale}&method=${data.method}&password=${data.password}&return_ssl_resources=${data.return_ssl_resources}&v=${data.v}&sig=${sig}`

  return url
}

/**
 * Get information of a user from access token
 */
exports.getUserInfo = function (accessToken, next) {
  $axios.public.get('https://graph.facebook.com/me?access_token=' + accessToken, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36'
    }
  })
    .then((res) => {
      var data = res.data
      var user = {
        'id': data.id,
        'access_token': accessToken,
        'name': data.name,
        'username': data.username,
        'email': data.email.toString(),
        'phone': data.mobile_phone.toString(),
        'birthday': new Date(data.birthday),
        'gender': data.gender,
        'location': data.location ? data.location.name : '',
        'hometown': data.hometown ? data.hometown.name : '',
        'verified': data.verified ? 1 : 0
      }
      next(null, user)
    })
    .catch((err) => {
      next(err, null)
    })
}