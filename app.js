const express = require('express');
const app = express();
const path = require('path');

app.set('port', (process.env.PORT || 3000));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
    console.log('loaded index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
