class Unit {

  constructor(unit) {
      this.unit = unit  
  }
  /**
   * @param {Object} params: { 
   *  length 'short' || 'long', 
   *  type: ''hanzi' || 'pinyin' || 'literal' || 'figurative' 
   * }
   * @param {String} value 
   */
  addComb(params, value) {
    var unit = this.unit
    unit[params.length][params.type].push(value)
    unit.push('') 
  }
  /**
   * 
   * @param {Object} params : {
   *  length 'short' || 'long', 
   *  type: ''hanzi' || 'pinyin' || 'literal' || 'figurative' 
   *  location: number
   *   
   * }
   * @param {String} value 
   */
  updateComb(params, value){
    var unit = this.unit
    var length = params.length
    var type = params.type
    var location = params.location
    var destination = unit[length][type][location]
    
    if(!destination) unit.push('') 
    destination = value
  }

}    