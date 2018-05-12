const Stringify = require('querystring').stringify

const $axios = require('./axios.js')
const $handle = require('./handle.js')

const BASE_URL = 'https://fbsub.pro'

const axios = $axios.create({
  'baseURL': BASE_URL
})

/**
 * Get interface
 */
exports.getInterface = function (accessToken, next) {
  let data = { accessToken, next }

  accessIndex(data)
}

function accessIndex(data) {
  axios.get('/')
    .then((res) => {
      var inputName = $handle.extractDataFromHtml(res.data, `autocomplete="off" type="text" name="`, '"')
      var hiddenName = $handle.extractDataFromHtml(res.data, `input hidden="hidden" name="`, '"')
      var cookie = res.headers['set-cookie']

      if (!inputName || !hiddenName || !cookie) {
        throw { 'message': 'Máy chủ không hoạt động.' }
      }

      data.cookie = cookie.toString()
      login(inputName, hiddenName, data)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function login(inputName, hiddenName, data) {
  axios.post('/', Stringify({ [inputName]: data.accessToken, [hiddenName]: 'fbsub.pro' }), {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      var cookie = res.headers['set-cookie']

      if (!cookie || !(res.data.eval && res.data.eval.indexOf('Welcome') !== -1)) {
        throw { 'message': 'Máy chủ đăng nhập thất bại.' }
      }

      data.cookie += '; ' + cookie.toString()
      accessAuto(data)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function accessAuto(data) {
  axios.get('/account/follow', {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      var credit = $handle.extractDataFromHtml(res.data, `<b  id="credit">`, '<')
      var urlCaptcha = $handle.extractDataFromHtml(res.data, `/account/captcha.php`, '"', true)

      if (credit === '0') {
        var waitingTime = $handle.extractDataFromHtml(res.data, `var seconds = `, ';')
        if (isNaN(waitingTime)) {
          throw { 'message': 'Máy chủ quá tải.', 'reload': true }
        } else {
          data.next(null, { 'waitingTime': Number(waitingTime) })
        }
      } else if (!credit || !urlCaptcha) {
        throw { 'message': 'Không thể lấy dữ liệu tại máy chủ kết bạn.' }
      } else {
        getCaptcha(urlCaptcha, credit, data)
      }
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function getCaptcha(urlCaptcha, credit, data) {
  axios.get(urlCaptcha, {
    responseType: 'arraybuffer',
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      var captchaBase64 = new Buffer(res.data, 'binary').toString('base64')
      var captchaSrc = 'data:image/png;base64,' + captchaBase64

      respond(data, credit, captchaSrc)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function respond(data, credit, captchaSrc) {
  data.next(null, {
    'credit': credit,
    'captchaSrc': captchaSrc,
    'cookie': data.cookie
  })
}

/**
 * Submit
 */
exports.submit = function (cookie, id, limit, captcha, next) {
  axios.post('/account/follow', Stringify({ id, limit, captcha }), {
    headers: {
      'Cookie': cookie
    }
  })
    .then((res) => {
      var message = $handle.extractDataFromHtml(res.data, `<font color="red">`, '<')
      if (typeof message !== 'string') {
        throw { 'message': 'Lỗi không xác định.', 'reload': true }
      }
      else if (message.indexOf('not have enough credits') !== -1) {
        throw { 'message': 'Bạn chưa đủ điều kiện hoạt động tại máy chủ này.' }
      }
      else if (message.indexOf('Security Code is incorrect') !== -1) {
        throw { 'message': 'Mã captcha không chính xác.' }
      }
      else if (message.indexOf('Not Valid') !== -1) {
        throw { 'message': 'ID không chính xác hoặc tài khoản chưa mở chế độ kết bạn.' }
      }
      else if (message.indexOf('have been sent') !== -1) {
        next(null, { 'message': 'Tự động kết bạn thành công.' })
      }
      else {
        throw { 'message': 'Máy chủ quá tải.', 'reload': true }
      }
    })
    .catch((err) => {
      next(err, null)
    })
}