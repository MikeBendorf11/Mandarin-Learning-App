const { GraphQLObjectType, 
        GraphQLInt, 
        GraphQLString, 
        GraphQlBool }= require('graphql')

const CharType = new GraphQLObjectType({
  name: 'Char',
  fields: () => ({
    relevance_id: {type: GraphQLInt},
    learned_id: {type: GraphQLInt}, 
    level: {type: GraphQLInt},
    consult: {type: GraphQlBool},
    hanzi: {type: GraphQLString},
    pinyin: {type: GraphQLString},
    literal: {type: GraphQLString},
    figurative: {type: GraphQLString},
  })
})