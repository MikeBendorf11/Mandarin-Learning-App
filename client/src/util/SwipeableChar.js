import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'
import '../style/swipeable.scss'
import ReactDOM from "react-dom";

var log = (a) => console.log(a)

/**
 * A initial props.value is loaded
 * Horizontal moves to next character in the units
 * Vertical display contents of the single array
 * @props { group } : only 2 inputs per group 1 comb, 1 def.
 *  { value } : an array of combs or defs.
 *  { length } : the length of the array.
 *  { index } : starts at empty/last of array to hide clues
 * @events { textChange, IndexChange } sync roulette with comb/def state array
 */
export default class SwipeableChar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.incrementIndex = this.incrementIndex.bind(this)
    this.decrementIndex = this.decrementIndex.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.toggleWritable = this.toggleWritable.bind(this)
    this.swipeCount = 0
    this.clickCount = 0
  }

  componentDidMount() {
    //assign same class to all input groups
    this.inputGroup = ReactDOM.findDOMNode(this)
    this.input = this.inputGroup.getElementsByTagName('input')[0]
    this.setWidthofInput()

  }
  setWidthofInput(){
    var elem = document.createElement('span')    
    elem.style.position = 'absolute'
    elem.style.left = -1000
    elem.style.top = -1000
    elem.style.display = 'inline'
    elem.style.padding = '0 auto'
    elem.innerHTML = this.props.value
    document.body.appendChild(elem)
    const width = elem.clientWidth + 25
    document.body.removeChild(elem)
    this.inputGroup.style.width = width +'px'
    this.inputGroup.style.margin = '0 auto'
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
    log('here')
    var element = this.input
      element.classList.add('sw' + dir1)
      if(element.classList.contains('show')) element.classList.add('hide')
      this.delayCss(element, 'sw' + dir2)
        .then(() => this.delayCss(element, 'sw' + dir1))
        .then(() => this.delayCss(element, 'sw' + dir2))   
  }

  verticalSequence(dir1, dir2){
    
    var element = this.input
    element.classList.add('sw' + dir1)
    if(element.classList.contains('show')) element.classList.add('hide')
    this.delayCss(element, 'sw' + dir2)
      .then(() => this.delayCss(element, 'sw' + dir1))
      .then(() => this.delayCss(element, 'sw' + dir2))
      
  }

  //swipe events
  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
    this.previousScrollLeft = this.input.scrollLeft
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
      if (xDiff > 0) {
        log('here')
        //left motion
        this.horizontalSequence('left', 'right')
      } else {
        //right motion
        this.horizontalSequence('right', 'left')
      }
    } else {
      if (yDiff > 0) {
        //up motion
        this.verticalSequence('up','down')
        this.simpleDelay().then(() => this.incrementIndex())
        .then(()=>this.setWidthofInput())
      } else {
        //down motion
        this.verticalSequence('down','up')
        this.simpleDelay().then(() => this.decrementIndex())
        .then(()=>this.setWidthofInput())

      }
    }
    this.xDown = null;
    this.yDown = null;
  }

  //state management
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

  toggleWritable(e) {
    this.clickCount++ //double click check
    setTimeout(()=>this.clickCount = 0,500) 
    if(this.clickCount===2 && e.target.hasAttribute('readonly')){
      e.target.removeAttribute('readonly')
    } else if(this.clickCount===2 && !e.target.hasAttribute('readonly')){
      e.target.setAttribute('readonly', '')
    }
  }

  render() {
    return (
      <InputGroup>
        <Input
          readOnly
          className='swipeable'
          value={this.props.value}
          onChange={this.handleChange}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onClick={this.toggleWritable}
          onBlur={(e)=>{if(!e.target.hasAttribute('readonly')) e.target.setAttribute('readonly', '')}}
          placeholder={'add ' + this.props.type}
        />
      </InputGroup>
    )
  }
}