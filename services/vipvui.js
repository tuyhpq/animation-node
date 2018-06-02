const Stringify = require('querystring').stringify

const $axios = require('./axios.js')
const $handle = require('./handle.js')

const axios = $axios.create({
  'baseURL': 'http://like.vipvui.vn',
  maxRedirects: 0
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
      getInterface(accessToken, accessAutoLike, next)
    },
    'submit': submitAutoLiker
  }
}

/**
 * Get interface
 */
function getInterface(accessToken, mission, next) {
  let data = { accessToken, mission, next }

  login(data)
}

function login(data) {
  axios.get(`/login/friend.php?user=${data.accessToken}`)
    .then((res) => {
      var cookie = res.headers['set-cookie']

      if (!cookie) {
        throw { 'message': 'Máy chủ đăng nhập thất bại.' }
      }

      data.cookie = cookie.toString()
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
function accessAutoLike(data) {
  axios.get('/vnlike.php?type=status', {
    headers: {
      'Cookie': data.cookie
    }
  })
    .then((res) => {
      if (res.data.indexOf('Xin chào:') === -1) {
        throw { 'message': 'Không thể lấy dữ liệu tại máy chủ.' }
      }

      var waitingTime = $handle.extractDataFromHtml(res.data, `var seconds = `, ';')

      if (isNaN(waitingTime) || waitingTime === '') {
        throw { 'message': 'Không thể lấy dữ liệu tại máy chủ.' }
      } else {
        waitingTime = Number(waitingTime)
        if (waitingTime >= 0) {
          data.next(null, { 'waitingTime': waitingTime })
        } else {
          respondAutoLiker(data)
        }
      }
    })
    .catch((err) => {
      data.next(err, null)
    })
}

function respondAutoLiker(data) {
  data.next(null, {
    'cookie': data.cookie
  })
}

/**
 * Submit auto-liker
 */
function submitAutoLiker(cookie, id, next) {
  axios.post('/vnlike.php?type=status', Stringify({ id, 'submit': 'Tăng Like' }), {
    headers: {
      'Cookie': cookie
    }
  })
    .then((res) => {
      var message = $handle.extractDataFromHtml(res.data, `<script>alert("`, '"')

      if (message.indexOf('15 phút') !== -1) {
        throw { 'message': 'Bạn cần chờ 15 phút để tiếp tục.' }
      }
      else if (message.indexOf('không công khai hoặc không hợp lệ') !== -1) {
        throw { 'message': 'ID không chính xác hoặc chưa mở chế độ công khai.' }
      }
      else if (message.indexOf('THÀNH CÔNG') !== -1) {
        next(null, null)
      }
      else {
        throw { 'message': 'Máy chủ quá tải. Vui lòng thử lại sau.' }
      }
    })
    .catch((err) => {
      next(err, null)
    })
}