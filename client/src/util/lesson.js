 
 import {observable, computed, autorun} from 'mobx'

 class Lesson {
   @observable order
  /**
   * @param {string} type2 : pinyin now, later hanzi or literal
   * props: orderSinChar, orderDouChar, orderComb
   */
  constructor(type2) {
    this.charTypes2 = ['hanzi', 'pinyin', 'literal', 'figurative']
    this.combTypes2 = ['hanzi', 'pinyin','figurative']
    this.order = {
      singleCh: this.getOrder('Character(s)', type2, 's' ),
      doubleCh: this.getOrder('Character(s)', type2, 'ss'),
      combs: this.getOrder('Short Combination(s)', type2, ''),
    }
    
  }
  /**
   *
   * @param {string} type char or comb
   * @param {string} startFrom hanzi, pinyin, literal, figurative
   * @param {string} for type char only, use char.hanzi
   * 
   * char single(doesn't have figurative) or multiple
   */
  getOrder(type, startFrom, hanzi){
    var result = [];
    var properties = []
    result.push(startFrom)

    switch(type){
      case 'Character(s)':
        properties = this.charTypes2
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
      case 'Short Combination(s)': case 'Long Combination(s)':
        var properties = this.combTypes2
        properties.forEach(prop=>{
          if(prop != startFrom) result.push(prop)
        })
        break
    }
    return result
  }
}

export default Lesson