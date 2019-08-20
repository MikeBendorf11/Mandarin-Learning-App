import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import {observable, computed, autorun} from 'mobx'
import Unit from './util/UnitModel'


var unit = new Unit(
  {
    id: 12,
    learnedId: 22,
    level: 1,
    consult: true,
    char:{ 
      hanzi: '就是', //char
      pinyin: 'jiùshi', //pronunciation
      literal: ['just', 'yes'], //definitions.single[0]
      figurative: 'truly', ////definitions.single[1]
    },
    short:{
      hanzi: ["就要"," 成就", ""], //combinations.short
      pinyin: ["","",""],
      //literal: can be derived from unit.root.literal
      figurative: [ 'will', 'achieve', ''], //definitions.short
    },
    long:{
      hanzi: ["#,因为就要下雨了" ,
             "这不是什么大不了的成就这不是什么大不了的成就",""], //comb.long
      pinyin: ["","",""],
      //literal: can be derived from unit.root.literal
      figurative: ["","",""], //definitions.long
    }
  }
)
unit.addComb({type1:'short',type2:'hanzi'}, '晚')
// unit.deleteComb({type1:'short', index:1})
 //console.log(unit.data.short)


function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review unit={unit}/>      
    </div>
  );
}

export default App;

