const express = require('express');
const app = express();
const path = require('path');

app.set('port', (process.env.PORT || 3000));

app.use(express.static('public'));

var nicepath = path.join(__dirname + '/index.html');
app.get('/', (req, res) => { res.sendFile(nicepath) });
app.get('/zach', (req, res) => { res.sendFile(nicepath) });
app.get('/phil', (req, res) => { res.sendFile(nicepath) });
app.get('/poem', (req, res) => { res.sendFile(nicepath) });
app.get('/john', (req, res) => { res.sendFile(nicepath) });
app.get('/sam', (req, res) => { res.sendFile(nicepath) });
app.get('/noah', (req, res) => { res.sendFile(nicepath) });
app.get('/shreyas', (req, res) => { res.sendFile(nicepath) });
app.get('/guavocado', (req, res) => { res.sendFile(nicepath) });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
