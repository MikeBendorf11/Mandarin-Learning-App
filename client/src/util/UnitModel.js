import {observable, computed, autorun} from 'mobx'
import { objectExpression } from '@babel/types';

//should be part of another model?
var types2 = ['hanzi' , 'pinyin' , 'figurative']

class Unit {

  @observable char
  @observable short
  @observable long

  constructor(unit) {
      this.id = unit.id
      this.learnedId = unit.learnedId
      this.level = unit.level
      this.consult = unit.consult
      this.char = unit.char
      this.short = unit.short
      this.long = unit.long

      autorun(() => {
				console.log(this.report)
				//console.log(this.todos[0])
			});  
  }

  @computed get report(){
    return this.char.hanzi
  }
  /**
   * @param {Object} comb: { 
   *  type1 char || short || long,  
   *  type2: hanzi || pinyin || literal || figurative 
   *  index: index
   * }
   * @param {String} value 
   */
  addComb(comb, value) {
    comb.index = this[comb.type1][comb.type2].length-1
    this.updateComb(comb, value)
  }

  updateComb(comb, value){
    var type1 = this[comb.type1]
    type1[comb.type2][comb.index] = value
    types2.forEach(tp2=>type1[tp2].push(''))
  }

  deleteComb(comb){
    var type1 = this[comb.type1]
    types2.forEach(tp2=>
      type1[tp2] = type1[tp2].filter((v,i)=>i!=comb.index)
    )
  }
}    

export default Unit;