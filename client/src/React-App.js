
import React from 'react';
import Nav from './components/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu'
import Search from './components/Search'
import Review from './components/Review';
import {observable, computed, autorun} from 'mobx'
import Unit from './util/UnitModel'
import Lesson from "./util/Lesson"
import './style/App.css'

var unit = new Unit(
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
var lesson = new Lesson('pinyin')


//console.log(lesson)

function App() {
  fetch('/api/chars')
  .then(res => res.json())
  .then(data=>console.log(data))

  return (
    <div className={'main-container'}>
      
      <Nav/> 
      <Menu lesson={lesson} unit={unit}/>
      <Review lesson={lesson} unit={unit}/>      
      {/* <Search lesson={lesson} unit={unit} /> */}
           
    </div>
  );
}

export default App;

