import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import {observable, computed, autorun} from 'mobx'
import Unit from './util/UnitModel'

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review/>      
    </div>
  );
}

export default App;

var unit2 = {
  id: 12,
  learnedId: 22,
  level: 1,
  consult: true,
  hanzi: '就是',
  pinyin: 'jiùshi',
  literal: 'just, yes',
  figurative: 'truly',
  short:{
    hanzi: ["就要"," 成就", ""],
    pinyin: ["","",""],
    literal: ['just, want', 'finalize, just', ''],
    figurative: [ 'will', 'achieve', ''],
  },
  long:{
    hanzi: ["#,因为就要下雨了" ,
           "这不是什么大不了的成就这不是什么大不了的成就",""],
    pinyin: ["","",""],
    literal: ["","",""],
    figurative: ["","",""],
  }
}
var unit = new Unit(unit2)
unit.addComb({type1:'short',type2:'hanzi'}, '晚')
unit.deleteComb({type1:'short', index:1})
console.log(unit.data.short)