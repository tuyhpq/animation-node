const Axios = require('axios')
const QueryString = require('querystring')
const $handle = require('./handle.js')

const BASE_URL = 'https://vipfb.ru'

exports.getInterface = function (accessToken, next) {
  let axios = Axios.create({
    baseURL: BASE_URL,
    timeout: 30000
  })
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  let data = {
    baseURL: BASE_URL,
    accessToken,
    next,
    axios
  }

  accessIndex(data)
}

function accessIndex(data) {
  data.axios.get('/')
    .then((res) => {
      var inputName = $handle.extractDataFromHtml(res.data, `input type="text" name="`, '"')
      var cookie = res.headers['set-cookie']

      if (!inputName || !cookie) {
        throw { message: 'Máy chủ không hoạt động.' }
      }

      data.axios.defaults.headers.common['Cookie'] = cookie.toString()

      login(inputName, data)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function login(inputName, data) {
  data.axios.post('/', QueryString.stringify({ [inputName]: data.accessToken, 'submit': 'Submit' }))
    .then((res) => {
      if (res.data.indexOf('Logout') === -1) {
        throw { message: 'Máy chủ đăng nhập thất bại.' }
      }
      accessAuto(data)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function accessAuto(data) {
  data.axios.get('/autorequest.php')
    .then((res) => {
      if (res.data.indexOf('Next Submit') === -1) {
        throw { message: 'Không thể truy cập máy chủ tăng theo dõi.' }
      }

      var waitingTime = $handle.extractDataFromHtml(res.data, `var seconds = `, ';')
      var urlCaptcha = $handle.extractDataFromHtml(res.data, `/capthcax.php`, '"', true)

      if (isNaN(waitingTime)) {
        throw { message: 'Không thể truy cập máy chủ tăng theo dõi.' }
      }
      if (!urlCaptcha) {
        throw { message: 'Không tìm thấy mã captcha tại máy chủ tăng theo dõi.' }
      }

      urlCaptcha = data.baseURL + urlCaptcha
      getCaptcha(urlCaptcha)

      data.next(null, { waitingTime, urlCaptcha })
    })
    .catch((err) => {
      data.next(err, null)
    })
}
