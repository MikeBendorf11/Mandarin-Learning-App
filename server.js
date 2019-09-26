var express = require('express');
var app = express();
var path = require("path");
const PORT = process.env.PORT || 4000
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');

// Allow cross-origin
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});
app.use(express.static(__dirname + '/static'))

app.get('/api/chars', (req, res) => {
  const chars = 'asd'
  res.json(chars)
})
 
var server = app.listen(PORT, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening ' + host +'' + port)
}) 