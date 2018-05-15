const mysql = require('mysql')

var pool = mysql.createPool({
  host: 'sg4.fcomet.com',
  port: 3306,
  user: 'fbvnorg_tuyhpq',
  password: 'Huaphuquy687@',
  database: 'fbvnorg_users',
  dateStrings: true
})


exports.getUser = function (user) {
  pool.query('SELECT * FROM users WHERE ?', user, function (error, results) {
    debugger
    if (error) {
      console.log('loi')
    } else {

    }
  })
}

exports.addUser = function (user, next) {
  debugger
  pool.query('INSERT INTO users SET ? ON DUPLICATE KEY UPDATE success = success + 1, updated = CURRENT_TIMESTAMP, ?', [user, user], next)
}