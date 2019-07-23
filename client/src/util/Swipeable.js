import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Button, Input } from 'reactstrap'
import '../style/swipeable.scss'
import ReactDOM from "react-dom";

/**
 * A initial props.value is loaded
 * Horizontal swipe returns the new index for updating the next Comb and Def 
 * Vertical swipe only changes the position of the group, a div wrapper should 
 * reveal only one input at a time
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
    this.horizontalCount = 0
  }

  componentDidMount() {
    //assign same class to all elements of the same group
    const element = ReactDOM.findDOMNode(this)
    element.classList.add(this.group)
    //hide definitions
    element.getElementsByTagName('input')[0].classList.add(this.props.visibility)
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
      this.delayCss(element, 'sw' + dir2)
        .then(() => this.delayCss(element, 'sw' + dir1))
        .then(() => this.delayCss(element, 'sw' + dir2))
    })
  }
  //for up and down regular motion
  verticalSequence(dir) {
    this.group.forEach(element => {
      if (element.classList.contains('visible')) {
        element.classList.remove('visible')
        element.classList.add('sw' + dir, 'hidden')
      } else if (element.classList.contains('hidden')) {
        element.classList.remove('hidden')
        element.classList.add('sw' + dir, 'visible')
      }
    })
  }
  //for when roulette restarts
  verticalSequence2(dir) {

  }

  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
  }

  handleTouchMove(evt) {
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
        console.log(this.horizontalCount)
        //up motion
        if (this.horizontalCount == 0) {
          this.verticalSequence('up')
          //this.horizontalCount++
        }
        else if (this.horizontalCount != 0) {
          this.verticalSequence2('up')
          //this.horizontalCount--
        }


      } else {
        //down motion
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
    e.target.hasAttribute('readonly') ?
      e.target.removeAttribute('readonly') : e.target.setAttribute('readonly', '')
  }


  toggleWritable(e) {
    e.target.hasAttribute('readonly') ?
      e.target.removeAttribute('readonly') : e.target.setAttribute('readonly', '')
  }

  render() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText
            style={{ visibility: this.props.visibility }}
          >{this.props.index + 1}
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