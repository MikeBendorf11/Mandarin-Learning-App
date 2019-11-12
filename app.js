require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })

const express = require('express'),
      bodyParser = require('body-parser')
      app = express() ,
      path = require("path"),
      MongoClient = require('mongodb').MongoClient,
      client = new MongoClient(process.env.MONGOCONN, { useNewUrlParser: true });
const PORT = process.env.PORT || 3000

console.log()

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.post('/save',(rq,rs)=>{
  client.connect((err) => {
    if(err) console.log(err)
    var dt = rq.body

    if(!dt || dt.id == 'undefined') 
      return rs.json({'resp': 'invalid data'})
    
    const collection = client.db("chapp").collection("units");
    collection.updateOne({id: dt.id}, {$set:{
      id: dt.id,
      learnedId: dt.learnedId,
      level: dt.level,
      consult: dt.consult,
      char: dt.char,
      pronunciation: dt.pronunciation,
      combinations: dt.combinations,
      definitions: dt.definitions,
    }}, (err, res)=>{ 
      var obj = err ? err : res
      //console.log(err,res)
      rs.json(obj)
    })
  });
})

app.post('/load', (rq, rs)=>{
  client.connect((err) => {
    if(err) console.log(err)
    const collection = client.db("chapp").collection("units");
    collection.find({}).toArray((err,docs)=>{
      var obj = err ? err : docs
      rs.json(obj)
    })
  })
})

app.use(express.static(__dirname + '/static'))

var server = app.listen(PORT, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening ' + host +'' + port)
})

1==2