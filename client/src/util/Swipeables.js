import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'
import '../style/swipeable.scss'
import ReactDOM from "react-dom";
import Lesson from "./Lesson"

export default class SwipeableComb extends React.Component {
  constructor(props) {
    super(props);
    this.OnTextChange = this.OnTextChange.bind(this)
    this.getIndex = this.getIndex.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.toggleWritable = this.toggleWritable.bind(this)
    this.swipeCount = 0
    this.clickCount = 0

    var obj = this.props.value
    var type = this.props.type

    this.order = new Lesson().order(type, 'pinyin' , obj['pinyin'] || ''  )
    var orderIdx = 0
    

    switch(type){
      case 'char':
        var value = char[this.order[orderIdx]]
        break
      case 'comb':
        this.combLength = obj.figurative.length
        var combIdx =  0 //comb.pinyin.length-1
        var value = comb[this.order[orderIdx]][combIdx]
        break
    }

    this.state = { orderIdx, combIdx, value }
  }

  

}