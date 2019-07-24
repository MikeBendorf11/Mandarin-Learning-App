import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Button, Input } from 'reactstrap'
import '../style/swipeable.scss'
import ReactDOM from "react-dom";

/**
 * A initial props.value is loaded
 * Horizontal swipe returns the new index for updating the next Comb and Def 
 * Vertical swipe only changes the position of the group, a div wrapper should 
 * reveal only one input at a time
 * @param group: only 2 inputs per group 1 comb, 1 def
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

  componentDidMount() {
    //assign same class to all elements of the same group
    const element = ReactDOM.findDOMNode(this)
    element.classList.add(this.group)
    //hide definitions
    element.getElementsByTagName('input')[0].classList.add(this.props.opacity)
    this.simpleDelay().then(() => {
      this.group = document.querySelectorAll(`.${this.group} input`)
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

  //for when roulette restarts
  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
  }

  handleTouchMove(evt) {
    const comb = this.group[0]
    const def = this.group[1]
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        //left motion
        this.horizontalSequence('left', 'right')
        this.simpleDelay().then(() => this.incrementIndex())
      } else {
        //right motion
        this.horizontalSequence('right', 'left')
        this.simpleDelay().then(() => this.decrementIndex())
      }
    } else {
      if (this.yDiff > 0) {       
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
    e.target.hasAttribute('readonly') && e.target.classList.contains('show')?
      e.target.removeAttribute('readonly') : e.target.setAttribute('readonly', '')
  }

  render() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText style={this.props.opacity=='show'?{ opacity: 1 } : { opacity: 0 }}>
            {this.props.index + 1}
          </InputGroupText>
        </InputGroupAddon>
        <Input
          readOnly
          className='swipeable'
          value={this.props.value}
          onChange={this.handleChange}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onClick={this.toggleWritable}
        />
      </InputGroup>
    )
  }
}