import React from 'react';
import { FormGroup, Input } from 'reactstrap'
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
    var order = this.props.order

    //this.order = new Lesson().order(this.props.type, 'pinyin' , obj['hanzi'] || ''  )
    var orderIdx = 0
    var combIdx =  0//obj.pinyin.length-1
    this.isChar = this.props.type == 'Character(s)' ? true : false

    if(this.isChar){
      var value = obj[order[orderIdx]]
    } else {
      this.combLength = obj.figurative.length
      var value = obj[order[orderIdx]][combIdx]
    }

    this.state = { orderIdx, combIdx, value }
  }

  OnTextChange(e){
    var combIdx = this.state.combIdx
    var orderIdx = this.state.orderIdx
    var order = this.props.order

    var value = {}

    if(this.isChar){
      value = this.props.value[order[orderIdx]] = e.target.value
    } else {
      value = this.props.value[order[orderIdx]][combIdx] = e.target.value
    }
    this.setState({ orderIdx, combIdx, value })
  }

  componentDidMount() {
    //assign same class to all input groups
    this.labelGroup = ReactDOM.findDOMNode(this)
    this.input = this.labelGroup.getElementsByTagName('input')[0]
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
      element.classList.add('animate-' + dir1)

      this.delayCss(element, 'animate-' + dir2)
        .then(() => this.delayCss(element, 'animate-' + dir1))
        .then(() => this.delayCss(element, 'animate-' + dir2))
        .then(()=>this.reloadEllipsis())
  }

  verticalSequence(dir1, dir2){
    var element = this.input
    element.classList.add('animate-' + dir1)

    this.delayCss(element, 'animate-' + dir2)
      .then(() => this.delayCss(element, 'animate-' + dir1))
      .then(() => this.delayCss(element, 'animate-' + dir2))
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
            && this.swipeCount < 4){
            this.swipeCount++
            return
          }
          //forcing to evaluate once more in case previous condition became async
          else if (this.swipeCount < 4) return
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
    var order = this.props.order

    var value = {}

    switch(dir){
      case 'up':
          orderIdx = this.state.orderIdx + 1 > order.length - 1 ?
          0 : this.state.orderIdx + 1
          break
      case 'down':
          orderIdx = this.state.orderIdx - 1 < 0 ?
          order.length-1 : this.state.orderIdx -1
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
      value = this.props.value[order[orderIdx]]
    }else{
      value = this.props.value[order[orderIdx]][combIdx]
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
    var visibility = this.props.helpShows
    var order = this.props.order

    var nextOrder = this.state.orderIdx+1 > order.length-1 ? 0 : this.state.orderIdx +1
    var prevOrder = this.state.orderIdx-1 < 0 ? order.length-1 : this.state.orderIdx-1

    return (
      <FormGroup className="swipeables">
        <div className="swipeables__label--order" style={{visibility}}>{order[prevOrder] } <b> ↑ </b></div>
        <div className="swipeables__label--order" style={{visibility}}>{order[this.state.orderIdx]} <b> - </b></div>
        <div className="swipeables__label--order" style={{visibility}}>{order[nextOrder]} <b>↓</b></div>
        <label className="swipeables__label" style={{visibility}}>{this.props.type.toUpperCase()}: </label>
        <div className="swipeables--wrapper">
          <div className="swipeables__label--explore" style={{visibility}}><i><b>&#8592;</b>&nbsp;explore&nbsp;<b>&#8594;</b></i></div>
          <Input
            readOnly
            value={this.state.value}
            onChange={this.OnTextChange}
            onTouchStart={this.handleTouchStart}
            onTouchMove={(e)=>{this.handleTouchMove(e);
              e.target.setAttribute('readonly', '')}}
            onClick={(e)=>{this.toggleWritable(e); }}
            onBlur={(e)=>e.target.setAttribute('readonly', '')}
          />
        </div>


        <div className="swipeables__label--next" style={{visibility}}><span>&#8592;</span> <i>prev | next</i> <span>&#8594;</span></div>


      </FormGroup>
    )
  }
}