var md5 = require('md5')

/**
 * 
 */
module.exports.getUrlAccess = function (email, password) {
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