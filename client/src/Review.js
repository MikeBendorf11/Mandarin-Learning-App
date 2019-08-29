import React from 'react';
// import SwipeableComb2 from './util/SwipeableComb2'
// import SwipeableChar from './util/SwipeableChar'
import Swipeable from './util/Swipeable'
import {observer} from 'mobx-react'

/* from 19968 up
String.fromCharCode() //fro code get char
String.codePointAt() //string pos get code
*/

var log = (a) => console.log(a)

@observer
class Review extends React.Component {
  constructor(props) {
    super(props);

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

    return (
      <div id="review-block">
        <div id="single-block">
          <Swipeable
            value={char}
            type={'Character(s)'}
            opacity={'show'}
          /> <br></br>
        </div>
        <div id='combs-block'>
          <Swipeable
            value={short}
            type={'Short Combination(s)'}
            opacity={'show'}
          /><br></br>
          <Swipeable
            value={long}
            type={'Long Combination(s)'}
            opacity={'show'}
          />
        </div>
      </div>
    )
  }
}

export default Review
 