import React from 'react';
// import SwipeableComb2 from './util/SwipeableComb2'
// import SwipeableChar from './util/SwipeableChar'
import Swipeable from './util/Swipeable'
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

    return (
      <div className="review">
        <QuestionIcon onClick={()=>{
           this.setState({helpIsVisible: !this.state.helpIsVisible})
          }}/>
        <div className="character">
          <Swipeable
            value={char}
            type={'Character(s)'}
            helpShows={visibility}
          /> <br></br>
        </div>
        <div className='combination'>
          <Swipeable
            value={short}
            type={'Short Combination(s)'}
            helpShows={visibility}
          /><br></br>
          <Swipeable
            value={long}
            type={'Long Combination(s)'}
            helpShows={visibility}
          />
        </div>
      </div>
    )
  }
}

export default Review
 