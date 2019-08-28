import React from 'react';
import { labelGroup, labelGroupAddon, labelGroupText, Input } from 'reactstrap'
import '../style/swipeable.scss'
import ReactDOM from "react-dom";
import Lesson from "./Lesson"

/**
 * A initial props.value is loaded
 * Horizontal swipe returns the new index for updating the next Comb and Def
 * Vertical swipe only controls comb or def input opacity and position
 * @props { group } : only 2 inputs per group 1 comb, 1 def.
 *  { type } : whether is a comb or a def input
 *  { value } : an array of combs or defs.
 *  { length } : the length of the array.
 *  { index } : starts at empty/last of array to hide clues
 * @events { textChange, IndexChange } sync roulette with comb/def state array
 */
export default class SwipeableComb extends React.Component {
  constructor(props) {
    super(props);
    this.group = this.props.group
    this.handleChange = this.handleChange.bind(this)
    this.incrementIndex = this.incrementIndex.bind(this)
    this.decrementIndex = this.decrementIndex.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.toggleWritable = this.toggleWritable.bind(this)
    this.swipeCount = 0
    this.clickCount = 0

    var combs = this.props.value
    this.order = new Lesson().combOrder('pinyin')
    this.length = this.order.length
    var index = 0
    var value = combs[this.order[index]]
    this.state={index, value}
  }

  componentDidMount() {
    //assign same class to all input groups
    const labelGroup = ReactDOM.findDOMNode(this)
    labelGroup.classList.add(this.group)
    //hide definitions
    this.input = labelGroup.getElementsByTagName('input')[0]
    this.input.classList.add(this.props.opacity)
    this.simpleDelay().then(() => {
      this.group = document.querySelectorAll(`
      .${this.group} input,
      .${this.group} .input-group-prepend
      `)
    })
    .then(()=>{ //if text overflows
      if(this.input.clientWidth < this.input.scrollWidth) 
        this.input.classList.add('hide-overflow')
    })
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
    
    this.group.forEach(element => {
      element.classList.add('sw' + dir1)
      if(element.classList.contains('show')) element.classList.add('hide')
      this.delayCss(element, 'sw' + dir2)
        .then(() => this.delayCss(element, 'sw' + dir1))
        .then(() => this.delayCss(element, 'sw' + dir2))
        .then(()=>{
          if(element.classList.contains('show')) element.classList.remove('hide')
        })
    })
  }

  //swipe events
  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
    this.previousScrollLeft = this.input.scrollLeft
    this.input.classList.remove('hide-overflow')
  }
  //group 1, 3 are the input elements only, 0, 4 are the div>span number containers
  handleTouchMove(evt) {
    if(evt.target.classList.contains('hide')) return; //reject hidden

    //console.log(this.input.style) 
    const comb = this.group[1]
    const def = this.group[3]
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant.
      if (xDiff > 0) {
        //left motion
        //only if text overflows
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
        this.simpleDelay().then(() => this.incrementIndex())
      } else {
        //right motion
        if(this.input.scrollLeft !== 0 ) return //is text scrolled to left?
        this.horizontalSequence('right', 'left')
        this.simpleDelay().then(() => this.decrementIndex())
      }
    } else {
      if (yDiff > 0) {
        //up motion
        comb.classList.remove('show')
        comb.classList.add('hide','up')
        def.classList.remove('hide')
        def.classList.add('show', 'up')

      } else {
        //down motion
        comb.classList.remove('hide', 'up')
        comb.classList.add('show')
        def.classList.add('hide')
        def.classList.remove('show','up')
      }
    }
    this.xDown = null;
    this.yDown = null;
  }
  //if text overflows
  reloadEllipsis(){
    if(this.input.clientWidth < this.input.scrollWidth) 
      this.input.classList.add('hide-overflow')
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
    this.reloadEllipsis()
  }

  decrementIndex() {
    var index = this.props.index
    var length = this.props.length
    if (index - 1 < 0)
      this.props.onIndexChange(length - 1)
    else this.props.onIndexChange(index - 1)
    this.reloadEllipsis()
  }

  toggleWritable(e) {
     //don't toggle hidden inputs
    if(!e.target.classList.contains('show')) return;
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
      <labelGroup>
        {/* The comb counter */}
        <labelGroupAddon addonType="prepend" 
                         className={this.props.opacity + ' swipeable'}>
          <labelGroupText>{this.props.index + 1}</labelGroupText>
        </labelGroupAddon>
        <Input
          readOnly
          className='swipeable'
          value={this.state.value}
          onChange={this.handleChange}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onClick={this.toggleWritable}
          onBlur={(e)=>{if(!e.target.hasAttribute('readonly')) e.target.setAttribute('readonly', '')}}
          placeholder={'add ' + this.props.type}
        />
      </labelGroup>
    )
  }
}