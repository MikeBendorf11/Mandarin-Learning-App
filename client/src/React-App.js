
import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/menu'
import Search from './components/search'
import Review from './components/review';
import {observable, computed, autorun} from 'mobx'
import unit from './util/unitModel'
import lesson from "./util/lesson"


var theunit = new unit(
  {
    id: 12,
    learnedId: 22,
    level: 1,
    consult: true,
    
    /**todo:
     * add commas on multiple pinyin so I don't have to call api for comb pinyin
     * match short and long comb order
     *  */
    char:{ 
      hanzi: '就是', //char
      pinyin: 'jiùshi', //pronunciation
      literal: 'just, yes', //definitions.single[0]
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
//unit.addComb({type1:'short',type2:'hanzi'}, '晚')
// unit.deleteComb({type1:'short', index:1})
 //console.log(unit.data.short)
var thelesson = new lesson('pinyin')


//console.log(lesson)

function App() {

  fetch('/api/chars')
  .then(res => res.json())
  .then(data=>console.log(data))

  return (
    <div className={'main-container'}>
      
      <Nav/> 
      <Menu lesson={thelesson} unit={theunit}/>
      <Review lesson={thelesson} unit={theunit}/>      
      {/* <Search lesson={thelesson} unit={unit} /> */}
           
    </div>
  );
}

export default App;

