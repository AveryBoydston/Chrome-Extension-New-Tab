var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'btvk3a0qoum8oseub1ui-mysql.services.clever-cloud.com',
  user     : 'usnswxrnluysprgq',
  password : 'n1bb9x0BTOcgVN3buk9s',
  database : 'btvk3a0qoum8oseub1ui'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();