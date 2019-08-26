export default class Lesson {
  constructor() {
  }
  
  charOrder(startfrom, char) {
    var result = []
    var properties = properties = ['hanzi', 'pinyin', 'literal', 'figurative']

    result.push(startfrom)

    if (char.length > 1){
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
      if(prop != startfrom && prop != 'pinyin') result.push(prop)
    })
    return result
  }
}