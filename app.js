var express = require('express');
var app = express();
var path = require("path");
const PORT = process.env.PORT || 3000

const MongoClient = require('mongodb').MongoClient;

const config = require('./database');

const client = new MongoClient(config.database, { useNewUrlParser: true });

client.connect((err, db) => {
  const collection = client.db("test").collection("units");
  1==2
  // perform actions on the collection object
  collection.updateOne({id:123}, {$set:{consult:false}})
  collection.find({id:123}).toArray(function(err, docs) {
      
    console.log(docs)
    client.close()
    
  });
  
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.post('/save',(rq,rs)=>{

  console.log(rq.query)
  rs.json({aky: 'hi'})
})

app.use(express.static(__dirname + '/static'))

var server = app.listen(PORT, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening ' + host +'' + port)
})

1==2