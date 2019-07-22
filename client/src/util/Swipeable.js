import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap'
import '../style/swipeable.scss'
import ReactDOM from "react-dom";

/**
 * Increment and Decrement index should be triggered by swipe left and right
 * Swipe up and down should only switch between combination and definition
 */
export default class Swipeable extends React.Component {
  constructor(props) {
    super(props);
    this.group = this.props.group
    this.handleChange = this.handleChange.bind(this)
    this.incrementIndex = this.incrementIndex.bind(this)
    this.decrementIndex = this.decrementIndex.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
  }
  componentDidMount(){
    const element = ReactDOM.findDOMNode(this)
    element.classList.add(this.group)
    const elements = document.querySelectorAll(`.${this.group}`)
    console.log(elements)
  }
  delayCss(element, cssClass){
    return new Promise(resolve=>{
      setTimeout(() => {
        element.classList.contains(cssClass) ?
          element.classList.remove(cssClass) : 
          element.classList.add(cssClass)
        resolve()
      },300);
    })
  }
  delayState(){
    return new Promise(resolve=>{
      setTimeout(() => {
        resolve()
      }, 400);
    })
  }
  swipeSequence(dir1, dir2, element){
    element.classList.add('sw'+dir1)
    this.delayCss(element, 'sw'+dir2)
    .then(()=>this.delayCss(element, 'sw'+dir1))
    .then(()=>this.delayCss(element, 'sw'+dir2))
  }
  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
  }
  handleTouchMove(evt) {
    const element = evt.target

    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        //this.onLeft();
        this.swipeSequence('left','right', element)
        this.delayState().then(()=>this.incrementIndex())
        
        
      } else {
        //this.onRight();
        this.swipeSequence('right','left', element)
        this.delayState().then(()=>this.decrementIndex())
      }
    } else {
      if (this.yDiff > 0) {
        //this.onUp();
      } else {
        //this.onDown();
      }
    }

    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }
  handleChange(event) {
    this.props.onTextChange(event.target.value)
  }
  incrementIndex() {
    var index = this.props.index
    var length = this.props.length
    if (index + 1 > length - 1)
      this.props.onIndexChange(0)
    else this.props.onIndexChange(index + 1)
  }
  decrementIndex() {
    var index = this.props.index
    var length = this.props.length
    if (index - 1 < 0)
      this.props.onIndexChange(length - 1)
    else this.props.onIndexChange(index - 1)
  }

  render() {
    return (
      <InputGroup>
        <Input
          className='swipeable'
          value={this.props.value}
          onChange={this.handleChange}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
        />
      </InputGroup>

    )
  }
}