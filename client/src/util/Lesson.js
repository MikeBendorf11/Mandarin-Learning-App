export default class Lesson {
  constructor() {
  }
  /**
   * 
   * @param {string} type char or comb 
   * @param {string} startFrom hanzi, pinyin, literal, figurative
   * @param {string} hanzi for type char use char.hanzi
   */
  order(type, startFrom, hanzi){
    var result, properties = []
    result.push(startFrom)

    switch(type){
      case 'char':
        properties = ['hanzi', 'pinyin', 'literal', 'figurative']
        if (hanzi.length > 1){
          properties.forEach(prop => {
            if(prop != startFrom) result.push(prop)
          })
        }
        else {
          properties.forEach(prop => {
            if(prop != startFrom && prop != 'figurative')
              result.push(prop)
          })
        }
        break
      case 'comb':
        var properties = ['hanzi', 'pinyin','figurative']
        properties.forEach(prop=>{
          if(prop != startFrom) result.push(prop)
        })
        break
    }
    return result
  }

  charOrder(startfrom, hanzi) {
    var result = []
    var properties = properties = ['hanzi', 'pinyin', 'literal', 'figurative']

    result.push(startfrom)

    if (hanzi.length > 1){
      properties.forEach(prop => {
        if(prop != startfrom) result.push(prop)
      })
    }
    else {
      properties.forEach(prop => {
        if(prop != startfrom && prop != 'figurative')
          result.push(prop)
      })
    }
    return result
  }
  combOrder(startfrom){
    var properties = ['hanzi', 'pinyin','figurative']
    var result = []
    result.push(startfrom)
    properties.forEach(prop=>{
      if(prop != startfrom) result.push(prop)
    })
    return result
  }
}