//should be part of another model?
var types2 = ['hanzi' , 'pinyin' , 'literal' , 'figurative']

export default class Unit {

  constructor(unit) {
      this.data = unit   
  }
  /**
   * @param {Object} comb: { 
   *  type1 short || long,  
   *  type2: hanzi || pinyin || literal || figurative 
   *  index: index
   * }
   * @param {String} value 
   */
  addComb(comb, value) {
    comb.index = this.data[comb.type1][comb.type2].length-1
    this.updateComb(comb, value)
  }

  updateComb(comb, value){
    var type1 = this.data[comb.type1]
    type1[comb.type2][comb.index] = value
    types2.forEach(tp2=>type1[tp2].push(''))
  }

  deleteComb(comb){
    var type1 = this.data[comb.type1]
    types2.forEach(tp2=>
      type1[tp2] = type1[tp2].filter((v,i)=>i!=comb.index)
    )
  }
}    