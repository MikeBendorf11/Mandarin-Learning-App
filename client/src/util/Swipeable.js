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

    this.order = new Lesson().order(this.props.type, 'pinyin' , obj['pinyin'] || ''  )
    var orderIdx = 1
    var combIdx =  1//obj.pinyin.length-1
    this.isChar = this.props.type == 'char' ? true : false

    if(this.isChar){
      var value = obj[this.order[orderIdx]]
    } else {
      this.combLength = obj.figurative.length
      var value = obj[this.order[orderIdx]][combIdx]
    }

    this.state = { orderIdx, combIdx, value }
  }

  OnTextChange(e){
    var combIdx = this.state.combIdx
    var orderIdx = this.state.orderIdx
    var value = {}

    if(this.isChar){
      value = this.props.value[this.order[orderIdx]] = e.target.value
    } else {
      value = this.props.value[this.order[orderIdx]][combIdx] = e.target.value
    }
    this.setState({ orderIdx, combIdx, value })
  }

  componentDidMount() {
    //assign same class to all input groups
    this.inputGroup = ReactDOM.findDOMNode(this)
    this.input = this.inputGroup.getElementsByTagName('input')[0]
    this.reloadEllipsis()
    
  }

  delayCss(element, cssClass) {
    return new Promise(resolve => {
      setTimeout(() => {
        element.classList.contains(cssClass) ?
          element.classList.remove(cssClass) :
          element.classList.add(cssClass)
        resolve()
      }, 250);
    })
  }
  simpleDelay() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 300);
    })
  }
  horizontalSequence(dir1, dir2) {
    var element = this.input
      element.classList.add('sw' + dir1)
      if(element.classList.contains('show')) element.classList.add('hide')
      this.delayCss(element, 'sw' + dir2)
        .then(() => this.delayCss(element, 'sw' + dir1))
        .then(() => this.delayCss(element, 'sw' + dir2))
        .then(()=>this.reloadEllipsis())
  }

  verticalSequence(dir1, dir2){
    var element = this.input
    element.classList.add('sw' + dir1)
    if(element.classList.contains('show')) element.classList.add('hide')
    this.delayCss(element, 'sw' + dir2)
      .then(() => this.delayCss(element, 'sw' + dir1))
      .then(() => this.delayCss(element, 'sw' + dir2))
      .then(()=>this.reloadEllipsis())
  }
  //swipe events
  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
    this.previousScrollLeft = this.input.scrollLeft
    this.input.classList.remove('hide-overflow')
  }

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant.
      //horizontal motion
      if (xDiff > 0 && this.isChar) {//left
        this.horizontalSequence('left', 'right')
        //next char
      }
      else if(xDiff < 0 && this.isChar) {//right
        this.horizontalSequence('right', 'left')
        //prev char
      }
      else if (xDiff > 0 && !this.isChar) {//left for combs
        
        //left motion
        //if text overflows
        if(this.input.clientWidth < this.input.scrollWidth){
          if(this.previousScrollLeft === 0) return
          else if(this.previousScrollLeft === this.input.scrollLeft 
            && this.swipeCount < 5){
            this.swipeCount++
            return  
          }  
          //forcing to evaluate once more in case previous condition became async
          else if (this.swipeCount < 5) return
        }
        this.swipeCount = 0
        this.input.style.textOverFlow = 'unset'

        this.horizontalSequence('left', 'right')
        this.simpleDelay().then(() => this.getIndex('left'))
      }
      else if(xDiff < 0 && !this.isChar){//right for combs
        if(this.input.scrollLeft !== 0 ) return //is text scrolled to left?
        this.horizontalSequence('right', 'left')
        this.simpleDelay().then(() => this.getIndex('right'))
      }
    } else {
      //vertical motion
      if (yDiff > 0) { //up

        this.verticalSequence('up','down')
        this.simpleDelay().then(() => this.getIndex('up'))
      } else { //down
        this.verticalSequence('down','up')
        this.simpleDelay().then(() => this.getIndex('down'))

      }
    }
    this.xDown = null;
    this.yDown = null;
  }
 /**
   *
   * @param {string} dir : up, down, left, right
   */
  getIndex(dir){
    var orderIdx = this.state.orderIdx
    var combIdx = this.state.combIdx
    var value = {}

    switch(dir){
      case 'up':
          orderIdx = this.state.orderIdx + 1 > this.order.length - 1 ?
          0 : this.state.orderIdx + 1
          break
      case 'down':
          orderIdx = this.state.orderIdx - 1 < 0 ?
          this.order.length-1 : this.state.orderIdx -1
          break
      case 'left':
          combIdx = this.state.combIdx + 1 > this.combLength -1 ?
          0: this.state.combIdx + 1
          break
      case 'right':
          combIdx = this.state.combIdx - 1 < 0 ?
          this.combLength-1 : this.state.combIdx -1
          break
    }

    if(this.isChar){
      value = this.props.value[this.order[orderIdx]]
    }else{
      value = this.props.value[this.order[orderIdx]][combIdx]
    }

    this.setState({ orderIdx, combIdx, value })
  }

  reloadEllipsis(){
    if(this.input.clientWidth < this.input.scrollWidth) 
      this.input.classList.add('hide-overflow')
  }

  toggleWritable(e) {
    this.clickCount++ //double click check
    setTimeout(()=>this.clickCount = 0,500)
    if(this.clickCount===2){
      e.target.hasAttribute('readonly') ?
        e.target.removeAttribute('readonly') :
        e.target.setAttribute('readonly', '')
    }
  }
  render() {
    return (
      <InputGroup>
        <Input
          readOnly
          className='swipeable'
          value={this.state.value}
          onChange={this.OnTextChange}
          onTouchStart={this.handleTouchStart}
          onTouchMove={(e)=>{this.handleTouchMove(e);
            e.target.setAttribute('readonly', '')}}
          onClick={(e)=>{this.toggleWritable(e); }}
          onBlur={(e)=>e.target.setAttribute('readonly', '')}
        />
      </InputGroup>
    )
  }
}