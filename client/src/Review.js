import React from 'react';
import SwipeableComb2 from './util/SwipeableComb2'
import SwipeableChar from './util/SwipeableChar'
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
          <SwipeableChar
            value={char}
            opacity={'show'}
          />
          <SwipeableComb2
            value={short}
            opacity={'show'}
          />
        </div>
        <div id='combs-block'>

          {/* <SwipeableComb
            group={'short'}
            // type={this.reviewOrder[0]}
            value={short}
            // length={this.state.shortHz.length}
            // index={indexSht}
            // onTextChange={this.handleShtCombChange}
            // onIndexChange={this.handleShtIdxChange}
            opacity={'show'}
          /> */}
        </div>
      </div>
    )
  } 
}
export default Review
    /*
    this.handleSglChange = this.handleSglChange.bind(this)
    this.handleSglIdxChange = this.handleSglIdxChange.bind(this)
    this.handleShtCombChange = this.handleShtCombChange.bind(this)
    this.hangleShtDefChange = this.hangleShtDefChange.bind(this)
    this.handleShtIdxChange = this.handleShtIdxChange.bind(this)
    this.handleLngIdxChange = this.handleLngIdxChange.bind(this)
    this.handleLngCombChange = this.handleLngCombChange.bind(this)
    this.handleLngDefChange = this.handleLngDefChange.bind(this)
    
    
    this.state = {
      single: unitMainArr,
      shortHz: unit2.short.hanzi,
      shortFig: unit2.short.figurative,
      longHz: unit2.long.hanzi,
      longFig: unit2.long.figurative,
      indexSgl: 0,
      indexSht: unit2.short.hanzi.length-1,
      indexLng: unit2.long.hanzi.length-1
    }
  }
  getFontSize(textType){
    switch(textType){
      case 'pinyin': case 'hanzi': case 'combination':
        return '2em';
      default: 
        return '1em';
    }
  }
  handleSglChange(value){
    var single = this.props.unit.single
    single[this.state.indexSgl] = value
    this.setState({ single })
  }
  handleSglIdxChange(indexSgl){
    this.setState({ indexSgl })
  }
  handleShtCombChange(value) {
    var shortHz = this.state.shortHz
    shortHz[this.state.indexSht] = value
    this.setState({ shortHz })
  }
  hangleShtDefChange(value) {
    var shortFig = this.state.shortFig
    shortFig[this.state.indexSht] = value
    this.setState({ shortFig })
  }
  handleShtIdxChange(indexSht) {
    this.setState({ indexSht })
  }
  handleLngIdxChange(indexLng){
    this.setState({ indexLng })
  }
  handleLngCombChange(value){
    var longHz = this.state.longHz
    longHz[this.state.indexLng] = value
    this.setState({longHz})
  }
  handleLngDefChange(value){
    var longFig = this.state.longFig
    longFig[this.state.indexLng] = value
    this.setState({longFig})
  }
  render() {
    const indexSht = this.state.indexSht
    const indexLng = this.state.indexLng
    const indexSgl = this.state.indexSgl

    return (
      <div id="review-block">
        <div id="char-block">
          <SwipeableChar
            value={this.state.single[indexSgl]}
            length={this.state.single.length}
            index={indexSgl}
            onTextChange={this.handleSglChange}
            onIndexChange={this.handleSglIdxChange}
            opacity={'show'}
          />
        </div>
        <div id='combs-block'>
          <SwipeableComb
            group={'short'}
            type={this.reviewOrder[0]}
            value={this.state.shortHz[indexSht]}
            length={this.state.shortHz.length}
            index={indexSht}
            onTextChange={this.handleShtCombChange}
            onIndexChange={this.handleShtIdxChange}
            opacity={'show'}
          />
          <SwipeableComb
            group={'short'}
            type={this.reviewOrder[1]}
            value={this.state.shortFig[indexSht]}
            length={this.state.shortFig.length}
            index={indexSht}
            onTextChange={this.hangleShtDefChange}
            onIndexChange={this.handleShtIdxChange}
            opacity={'hide'}
          />
          <SwipeableComb
            group={'long'}
            type={this.reviewOrder[0]}
            value={this.state.longHz[indexLng]}
            length={this.state.longHz.length}
            index={indexLng}
            onTextChange={this.handleLngCombChange}
            onIndexChange={this.handleLngIdxChange}
            opacity={'show'}
          />
          <SwipeableComb
            group={'long'}
            type={this.reviewOrder[1]}
            value={this.state.longFig[indexLng]}
            length={this.state.longFig.length}
            index={indexLng}
            onTextChange={this.handleLngDefChange}
            onIndexChange={this.handleLngIdxChange}
            opacity={'hide'}
          />
        </div>


        

      </div>

    )*/
  
