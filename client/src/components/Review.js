import React from 'react';
// import SwipeableComb2 from './util/SwipeableComb2'
// import SwipeableChar from './util/SwipeableChar'
import Swipeable from '../util/swipeable'
import {observer} from 'mobx-react'
import QuestionIcon from 'react-ionicons/lib/IosHelpCircleOutline'

/* from 19968 up
String.fromCharCode() //fro code get char
String.codePointAt() //string pos get code
*/

var log = (a) => console.log(a)

@observer
class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = { helpIsVisible : false}
  }

  getFontSize(textType){
    switch(textType){
      case 'pinyin': case 'hanzi': case 'combination':
        return '2em';
      default:
        return '1em';
    }
  }

  render() {
    var char = this.props.unit.char
    var short = this.props.unit.short
    var long = this.props.unit.long
    var visibility = this.state.helpIsVisible ? 'visible': 'hidden'
    var lesson = this.props.lesson
    var orderChar = char.hanzi.length ==1? lesson.order.singleCh : lesson.order.doubleCh
    var orderComb = lesson.order.combs

    return (
      <div color="black" className="review">
        <QuestionIcon onClick={(e)=>{
          this.setState({helpIsVisible: !this.state.helpIsVisible})
          if(!this.state.helpIsVisible) e.target.setAttribute('fill','yellow')
          else e.target.setAttribute('fill','black')
          }}/>
        <div className="character">
          <Swipeable
            id={this.props.unit.id}
            value={char}
            type={'Character(s)'}
            helpShows={visibility}
            order={orderChar}
          />
        </div>
        <div className='combination'>
          <Swipeable
            value={short}
            type={'Short Combination(s)'}
            helpShows={visibility}
            order={orderComb}
          />
          <Swipeable
            value={long}
            type={'Long Combination(s)'}
            helpShows={visibility}
            order={orderComb}
          />
        </div>
      </div>
    )
  }
}

export default Review
