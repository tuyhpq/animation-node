const Axios = require('axios')

exports.create = function (config) {
  let axios = Axios.create(Object.assign({
    validateStatus: function (status) {
      return status >= 200 && status < 400
    },
    timeout: 30000
  }, config))

  axios.interceptors.request.use(function (config) {
    return config
  }, function (error) {
    if (typeof error !== 'object') {
      error = { 'message': typeof error === 'string' ? error : null }
    }
    return Promise.reject(error)
  })

  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    if (typeof error !== 'object') {
      error = { 'message': typeof error === 'string' ? error : null }
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    }
    return Promise.reject(error)
  })

  return axios
}