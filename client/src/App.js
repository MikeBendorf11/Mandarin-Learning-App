import React from 'react';
import Nav from './components/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu'
import Search from './components/Search'
import Review from './components/Review';
import {observable, computed, autorun} from 'mobx'
import Unit from './util/UnitModel'
import './style/App.css'

var unit = new Unit(
  {
    id: 12,
    learnedId: 22,
    level: 1,
    consult: true,
    //char single(doesn't have figurative) or multiple
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


function App() {
  return (
    <div className={'main-container'}>
      
      <Nav/> 
      <Menu unit={unit}/>
      {/* <Review unit={unit}/>       */}
      <Search unit={unit} />
      
        
      
      
    </div>
  );
}

export default App;

