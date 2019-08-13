//should be part of another model?
var types2 = ['hanzi' , 'pinyin' , 'literal' , 'figurative']

export default class Unit {

  constructor(unit) {
      this.data = unit   
  }
  /**
   * @param {Object} comb: { 
   *  type1 'short' || 'long', 
   *  type2: ''hanzi' || 'pinyin' || 'literal' || 'figurative' 
   * }
   * @param {String} value 
   */
  addComb(comb, value) {
    comb.location = this.data[comb.type1][comb.type2].length-1
    this.updateComb(comb, value)
  }
  /**
   * @param {Object} comb : {
   *  type1 'short' || 'long', 
   *  type2: ''hanzi' || 'pinyin' || 'literal' || 'figurative' 
   *  location: number
   * }
   * @param {String} value 
   */
  updateComb(comb, value){
    var type1 = this.data[comb.type1]
    type1[comb.type2][comb.location] = value
    types2.forEach(tp2=>type1[tp2].push(''))
  }

}    