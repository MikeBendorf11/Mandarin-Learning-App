var express = require('express');
var app = express();
var path = require("path");
const PORT = process.env.PORT || 3000

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});
app.use(express.static(__dirname + '/static'))

var server = app.listen(PORT, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening ' + host +'' + port)
})