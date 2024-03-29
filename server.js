require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })

const express = require('express')
const bodyParser = require('body-parser')
const path = require("path")
const fs = require('fs')
const PORT = process.env.PORT || 4000
const MongoClient = require('mongodb').MongoClient
const app = express()
var database, collection

app.use(bodyParser.json());

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening ' + host + '' + port)
})

app.get('/env', (rq, rs) => {
  rs.send(process.env.NODE_ENV || 'production')
})

app.post('/ready', (rq, rs)=>{
  //console.log(rq.body)
  if(rq.body.password==process.env.PASSWORD){
    MongoClient.connect(process.env.MONGOCONN, { useUnifiedTopology: true },(error,client)=>{
      let msg = ''
      if(error) throw error 
      if(process.env.NODE_ENV=='development'){
        database = client.db('test')
        msg = 'Using test credentials and testDB'
      } else {
        database = client.db('chapp')
        msg = 'Using admin credentials and ProdDB' 
      }
      collection = database.collection("units2.1")
      rs.send(`Prod: ${msg}`)
    }) 
  } else {
    MongoClient.connect(process.env.MONGOCONN, { useUnifiedTopology: true },(error,client)=>{
      if(error) throw error 
      database = client.db('test')
      collection = database.collection("units2.1")
      rs.send('Dev: Using no credentials and test DB ')
      //console.log('collection', collection)
    })     
    
  }
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

