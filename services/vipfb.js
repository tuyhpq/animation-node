const Stringify = require('querystring').stringify

const $axios = require('./axios.js')
const $handle = require('./handle.js')

const axios = $axios.create({
  'baseURL': 'https://vipfb.ru'
})

module.exports = {
  autoRequest: {
    'get': function (accessToken, next) {
      getInterface(accessToken, accessAutoRequest, next)
    },
    'submit': submitAutoRequest
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
      var input = $handle.extractDataFromHtml(res.data, `" name="`, '"')

      if (isNaN(waitingTime) || waitingTime === '' || !urlCaptcha || !input) {
        throw { message: 'Không thể lấy dữ liệu tại máy chủ.' }
      }
      else {
        waitingTime = Number(waitingTime)
        if (waitingTime >= 0) {
          data.next(null, { 'waitingTime': waitingTime })
        } else {
          data.input = input
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
    'cookie': data.cookie,
    'input': data.input
  })
}

/**
 * Submit auto-request
 */
function submitAutoRequest(cookie, id, captcha, input, next) {
  axios.post('/autorequest.php', Stringify({ [input]: id, 'captchaBox': captcha, 'submit': '' }), {
    headers: {
      'Cookie': cookie
    },
    maxRedirects: 0,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    }
  })
    .then((res) => {
      var message = res.headers.location
      if (message.indexOf('timeLimit') !== -1) {
        throw { 'message': 'Bạn chưa đủ điều kiện hoạt động tại máy chủ này.' }
      }
      else if (message.indexOf('errorCaptcha') !== -1) {
        throw { 'message': 'Mã captcha không chính xác.' }
      }
      else if (message.indexOf('ErrorID') !== -1) {
        throw { 'message': 'ID không chính xác hoặc tài khoản chưa mở chế độ kết bạn.' }
      }
      else if (message.indexOf('success') !== -1) {
        next(null, null)
      }
      else {
        throw { 'message': 'Máy chủ quá tải.' }
      }
    })
    .catch((err) => {
      next(err, null)
    })
}