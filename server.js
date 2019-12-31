require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })

const express = require('express'),
  bodyParser = require('body-parser')
app = express(),
  path = require("path"),
  MongoClient = require('mongodb').MongoClient,
  //client = new MongoClient(process.env.MONGOCONN, { useNewUrlParser: true }),
  fs = require('fs')
var database, collection
const PORT = process.env.PORT || 4000

app.use(bodyParser.json());

var server = app.listen(PORT, function () {
  MongoClient.connect(process.env.MONGOCONN, { useUnifiedTopology: true },(error,client)=>{
    if(error) throw error 
    database = process.env.NODE_ENV=='development'? 
      client.db('test'):client.db('chapp') 
    collection = database.collection("units2.1")
  }) 
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening ' + host + '' + port)
})

app.get('/env', (rq, rs) => {
  rs.send(process.env.NODE_ENV || 'production')
})

app.post('/save', (rq, rs) => {
  var dt = rq.body
  if (!dt || dt.id == 'undefined')
    return rs.json({ 'resp': 'invalid data' })

  //const collection = client.db("chapp").collection("units");
  collection.updateOne({ id: dt.id }, {
    $set: {
      id: dt.id,
      learnedId: dt.learnedId,
      level: dt.level,
      consult: dt.consult,
      char: dt.char,
      pronunciation: dt.pronunciation,
      combinations: dt.combinations,
      definitions: dt.definitions,
    }
  }, (err, res) => {
    var obj = err ? err : res
    //console.log(err,res)
    rs.json(obj)
  })
})

app.post('/load', (rq, rs) => {
  collection.find({}).toArray((err, docs) => {
    var obj = err ? err : docs
    rs.json(obj)
  })
})

app.post('/hanzi*', (rq, rs) => {
  console.log(rq.params[0])
  if (rq.url == '/hanzi/all') {
    rs.json(JSON.parse(fs.readFileSync('hanzi-writer/strokes-subtlex-1500.json.min')))
  } else {
    let char = rq.params[0].replace('/', '')
    rs.json(JSON.parse(fs.readFileSync('hanzi-writer/' + char + '.json')))
  }
})

app.get('/api/chars', (req, res) => {
  const chars = 'asd'
  res.json(chars)
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

