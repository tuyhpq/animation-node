const Stringify = require('querystring').stringify

const $axios = require('./axios.js')
const $handle = require('./handle.js')

const axios = $axios.create({
  'baseURL': 'https://fbsub.pro'
})

module.exports = {
  autoRequest: {
    'get': function (accessToken, next) {
      getInterface(accessToken, accessAutoRequest, next)
    },
    'submit': submitAutoRequest
  },
  autoLike: {
    'get': function (accessToken, next) {
      getInterface(accessToken, accessAutoLiker, next)
    },
    'submit': submitAutoLiker
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

      data.cookie += ';' + cookie.toString()
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
  axios.get('/account/follow', {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      var limit = $handle.extractDataFromHtml(res.data, `<b  id="credit">`, '<')
      var urlCaptcha = $handle.extractDataFromHtml(res.data, `/account/captcha.php`, '"', true)

      if (limit === '0') {
        var waitingTime = $handle.extractDataFromHtml(res.data, `var seconds = `, ';')
        if (isNaN(waitingTime) || waitingTime === '') {
          throw { 'message': 'Máy chủ quá tải.' }
        } else {
          data.next(null, { 'waitingTime': Number(waitingTime) })
        }
      } else if (!limit || !urlCaptcha) {
        throw { 'message': 'Không thể lấy dữ liệu tại máy chủ.' }
      } else {
        data.limit = limit
        getCaptchaForAutoRequest(urlCaptcha, data)
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
    'limit': data.limit
  })
}

/**
 * Submit auto-request
 */
function submitAutoRequest(cookie, id, limit, captcha, next) {
  axios.post('/account/follow', Stringify({ id, limit, captcha }), {
    headers: {
      'Cookie': cookie
    }
  })
    .then((res) => {
      var message = $handle.extractDataFromHtml(res.data, `<font color="red">`, '<')
      if (message.indexOf('not have enough credits') !== -1) {
        throw { 'message': 'Bạn chưa đủ điều kiện hoạt động tại máy chủ này.' }
      }
      else if (message.indexOf('Security Code is incorrect') !== -1) {
        throw { 'message': 'Mã captcha không chính xác.' }
      }
      else if (message.indexOf('Not Valid') !== -1) {
        throw { 'message': 'ID không chính xác hoặc tài khoản chưa mở chế độ kết bạn.' }
      }
      else if (message.indexOf('have been sent') !== -1) {
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

/**
 * Auto liker
 */
function accessAutoLiker(data) {
  axios.get('/account/liker', {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then(() => {
      axios.post('/account/liker', Stringify({ 'link': '813730915452307' }), {
        headers: {
          'Cookie': data.cookie
        }
      })
        .then((res) => {
          var limit = $handle.extractDataFromHtml(res.data, `<b  id="credit">`, '<')
          var urlCaptcha = $handle.extractDataFromHtml(res.data, `/account/captcha.php`, '"', true)

          if (limit === '0') {
            var waitingTime = $handle.extractDataFromHtml(res.data, `var seconds = `, ';')
            if (isNaN(waitingTime) || waitingTime === '') {
              throw { 'message': 'Máy chủ quá tải.' }
            } else {
              data.next(null, { 'waitingTime': Number(waitingTime) })
            }
          } else if (!limit || !urlCaptcha) {
            throw { 'message': 'Không thể lấy dữ liệu tại máy chủ.' }
          } else {
            data.limit = limit
            getCaptchaForAutoLiker(urlCaptcha, data)
          }
        })
        .catch((err) => {
          data.next(err, null)
        })
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function getCaptchaForAutoLiker(urlCaptcha, data) {
  axios.get(urlCaptcha, {
    responseType: 'arraybuffer',
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      var captchaBase64 = new Buffer(res.data, 'binary').toString('base64')
      var captchaSrc = 'data:image/png;base64,' + captchaBase64

      respondAutoLiker(data, captchaSrc)
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function respondAutoLiker(data, captchaSrc) {
  data.next(null, {
    'captchaSrc': captchaSrc,
    'limit': data.limit,
    'cookie': data.cookie
  })
}

/**
 * Submit auto-liker
 */
function submitAutoLiker(cookie, id, limit, captcha, next) {
  axios.post('/account/liker', Stringify({ id, limit, captcha, 'reactions[]': 'LIKE' }), {
    headers: {
      'Cookie': cookie
    }
  })
    .then((res) => {
      var message = $handle.extractDataFromHtml(res.data, `<font color="red">`, '<')
      if (message.indexOf('not have enough credits') !== -1) {
        throw { 'message': 'Bạn chưa đủ điều kiện hoạt động tại máy chủ này.' }
      }
      else if (message.indexOf('Security Code is incorrect') !== -1) {
        throw { 'message': 'Mã captcha không chính xác.' }
      }
      else if (message.indexOf('not available or your followers not public') !== -1) {
        throw { 'message': 'ID không chính xác hoặc chưa mở chế độ công khai.' }
      }
      else if (message.indexOf('have been sent') !== -1) {
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