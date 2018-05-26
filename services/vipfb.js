const Stringify = require('querystring').stringify

const $axios = require('./axios.js')
const $handle = require('./handle.js')

const BASE_URL = 'https://vipfb.ru'

const axios = $axios.create({
  'baseURL': BASE_URL
})

module.exports = {
  autoRequest: {
    'get': function (accessToken, next) {
      getInterface(accessToken, accessAutoRequest, next)
    },
    //  'submit': submitAutoRequest
  }
}

/**
 * Get interface
 */
function getInterface(accessToken, mission, next) {
  let data = { accessToken, mission, next }

  accessIndex(data)
}

function accessIndex(data) {
  axios.get('/')
    .then((res) => {
      var inputName = $handle.extractDataFromHtml(res.data, `input type="text" name="`, '"')
      var cookie = res.headers['set-cookie']

      if (!inputName || !cookie) {
        throw { message: 'Máy chủ không hoạt động.' }
      }

      data.cookie = cookie.toString()
      login(inputName, data)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function login(inputName, data) {
  axios.post('/', Stringify({ [inputName]: data.accessToken, 'submit': 'Submit' }), {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      if (res.data.indexOf('Logout') === -1) {
        throw { 'message': 'Máy chủ đăng nhập thất bại.' }
      }

      data.mission(data)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

/**
 * Auto request
 */
function accessAutoRequest(data) {
  axios.get('/autorequest.php', {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      if (res.data.toLowerCase().indexOf('next submit') === -1) {
        throw { message: 'Không thể truy cập vào máy chủ.' }
      }

      var waitingTime = $handle.extractDataFromHtml(res.data, `var seconds = `, ';')
      var urlCaptcha = $handle.extractDataFromHtml(res.data, `/NEW_Capthca.php`, '"', true)

      if (isNaN(waitingTime) || waitingTime === '' || !urlCaptcha) {
        throw { message: 'Không thể lấy dữ liệu tại máy chủ.' }
      }
      else {
        waitingTime = Number(waitingTime)
        if (waitingTime >= 0) {
          data.next(null, { 'waitingTime': waitingTime })
        } else {
          getCaptchaForAutoRequest(urlCaptcha, data)
        }
      }
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function getCaptchaForAutoRequest(urlCaptcha, data) {
  axios.get(urlCaptcha, {
    responseType: 'arraybuffer',
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      var captchaBase64 = new Buffer(res.data, 'binary').toString('base64')
      var captchaSrc = 'data:image/png;base64,' + captchaBase64

      respondAutoRequest(data, captchaSrc)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function respondAutoRequest(data, captchaSrc) {
  data.next(null, {
    'captchaSrc': captchaSrc,
    'cookie': data.cookie
  })
}