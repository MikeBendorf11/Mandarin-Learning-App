const axios = require('axios');
const https = require('https')

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require('graphql');


const CharType = new GraphQLObjectType({
  name: 'Char',
  fields: () => ({
    relevance_id: {type: GraphQLInt},
    learned_id: {type: GraphQLInt},
    level: {type: GraphQLInt},
    consult: {type: GraphQlBool},
    hanzi: {type: GraphQLString},
    pinyin: [{type: GraphQLString}],
    literal: [{type: GraphQLString}], //single, double
    figurative: {type: GraphQLString}, //double only
    combs: [{type: GraphQLString}]
  })
})

//not as important, part of Char
const ShortType = new GraphQLObjectType({
  name: 'Short',
  fields: () => ({
    relatedChar: {type: CharType},
    hanzi: {type: GraphQLString},
    figurative: [{type: GraphQLString}],
  })
})

const LongType = new GraphQLObjectType({
  name: 'Long',
  fields: () => ({
    relatedChar: {type: CharType},
    hanzi: {type: GraphQLString},
    figurative: [{type: GraphQLString}]
  })
})

axios
.get('http://api.myjson.com/bins/blpua')
.then(res=>{
  //units = JSON.parse(res.data)
  //console.log(res.data)
  units = res.data
  units.forEach((v,i)=>{

  })
})


class CharTree{
	constructor(str){
    this.order = str
    this.chars = {}
    Array.from(str).forEach(v=>this.chars[v] = new Char())
    if(str.length>2){
      this.getCombs(str)
    }
  }

  getCombs(str){

  }
}

//the top parent
class Single{
  constructor(char, children){}
}
//one parent for every char
class Short {
  constructor(chars, parents, children){}
}
//single, and short(not repited singles)
class Long{
  constructor(chars, parents){}
}

/**chars: single subtlex or short subtlex */
class Unit{
  constructor(relevanceId, learnedId, level, consult, chars ){
    this.tree = new CharTree(chars)
  }
}