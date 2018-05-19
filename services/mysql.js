const mysql = require('mysql')

var pool = mysql.createPool({
  host: 'sg4.fcomet.com',
  port: 3306,
  user: 'fbvnorg_tuyhpq',
  password: 'Huaphuquy687@',
  database: 'fbvnorg_users',
  dateStrings: true
})

exports.addUser = function (user, next) {
  pool.query('INSERT INTO users SET ? ON DUPLICATE KEY UPDATE success = success + 1, updated = CURRENT_TIMESTAMP, ?', [user, user], next)
}