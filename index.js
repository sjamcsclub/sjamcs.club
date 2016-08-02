var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

var client = new pg.Client();

app.get('/db', function(request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if (err) throw err;
		client.query("INSERT INTO test_table (name) VALUES ('hello postgres');", function(err, result) {
			if (err) {
				console.error(err);
				response.send('Error: ' + err);
			} else {
				client.query('SELECT * FROM test_table', function(err, result) {
					done();
					if (err) {
						console.error(err);
						response.send('Error: ' + err);
					} else {
						response.render('pages/db', {results: result.rows});
					}
				});
			}
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
