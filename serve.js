

var path = require('path');
var express = require('express');

var app = express();

//var staticPath = path.resolve(__dirname, '/public');
//app.use(express.static(staticPath));
app.use('/', express.static(__dirname));

var port = process.env.HTTP_PORT || 9000;

app.listen(port, function() {
  console.log('listening for DEV: on port %s', port);
});
