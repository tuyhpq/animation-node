var $free = require('./../services/vipvui')
var COOKIE = ''

/**
 * Free: Get forms for auto request
 */
exports.get = function (req, res) {
  // na
  var accessToken = 'EAAAAAYsX7TsBAF19wuyYPu6ZATkm3ZANE8W0O2VZAg6Cs4IhpxZCIhBV54EzdwdHBhaDNRU8faInkgBZBcJOjH6MOuQfsWRYi1SWvWixmyqJb4jOVR8oywukf6KvPHFvMXz4Nz6ZCrh1HVboQ27NG2WQ9CoXZB1JtnsOy3foEZAJhkfA9f71w4ww9PkDamD2BqQZBpfcQgLWnZCwZDZD'
  // chien
  var accessToken2 = 'EAAAAAYsX7TsBAFOqRYiByMQq3S9x9eFSHOZAB9lsr9Olpwo9hkbR6h2ZB1KZBjVNcV09ZBZCmtOGsy2nDVf2TmgM4tKTilZAEj4NUSIfBXWq5Mf2k7doOwfR4EZALX4EpXXIxfuFQfdRSu911z8PZAvpTSGeiefnyl2hGBbAH3hXwaA0HPnpquZBzKgssoBRzUVBcvcdvQ8uqnQZDZD'

  $free.autoLike.get(accessToken, (err, data) => {
    if (err) {
      res.status(400).json({ 'error': 'GET_FREELIKE_001', 'message': err.message })
    } else {
      var waitingTime = data.waitingTime
      if (waitingTime) {
        $free.autoLike.get(accessToken2, (err, data) => {
          if (err) {
            res.status(400).json({ 'error': 'GET_FREELIKE_001', 'message': err.message })
          } else {
            if (data.waitingTime) {
              if (waitingTime < data.waitingTime) {
                data.waitingTime = waitingTime
              }
            }
            COOKIE = data.cookie
            data.token = '2'
            res.json(data)
          }
        })
      }
      else {
        COOKIE = data.cookie
        data.token = '1'
        res.json(data)
      }
    }
  })
}

/**
 * Perform free like
 */
exports.submit = function (req, res) {
  var { id } = req.body

  if (typeof id === 'string' && id.length > 0) {
    $free.autoLike.submit(COOKIE, id, (err, data) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_FREELIKE_001', 'message': err.message })
      } else {
        res.json(null)
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}