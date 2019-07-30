import React from 'react';
import Swipeable from './util/Swipeable'

var unit = JSON.parse(`{"id":12,"learnedId":12,"level":1,"consult":true,"char":"就","pronunciation":"jiù","combinations":{"short":["就要"," 成就", ""],"long":["#,因为就要下雨了","这不是什么大不了的成就这不是什么大不了的成就",""]},"definitions":{"short":["will"," achieve",""],"long":["","",""],"single":["at once, just, go "]}}`)

export default class Review extends React.Component {
  constructor(props) {
    super(props);
    this.handleSglIdxChange = this.handleSglIdxChange.bind(this)
    this.handleShtCombChange = this.handleShtCombChange.bind(this)
    this.hangleShtDefChange = this.hangleShtDefChange.bind(this)
    this.handleShtIdxChange = this.handleShtIdxChange.bind(this)
    this.handleLngIdxChange = this.handleLngIdxChange.bind(this)
    this.handleLngCombChange = this.handleLngCombChange.bind(this)
    this.handleLngDefChange = this.handleLngDefChange.bind(this)

    if(unit.char.length>1 && unit.definitions.single>1){
      var singleDef = unit.definitions.single.toString()
      var isDoubleChar = true //single def is array
    } else {
      var singleDef = unit.definitions.single[0]
      var isDoubleChar = false
    }

    this.state = {
      single: [unit.pronunciation, unit.char, singleDef],
      shortComb: unit.combinations.short,
      shortDef: unit.definitions.short,
      longComb: unit.combinations.long,
      longDef: unit.definitions.long,
      indexSgl: 0,
      indexSht: unit.combinations.short.length-1,
      indexLng: unit.combinations.long.length-1
    }
  }
  handleSglIdxChange(indexSgl){
    this.setState({ indexSgl })
  }
  handleShtCombChange(value) {
    var shortComb = this.state.shortComb
    shortComb[this.state.indexSht] = value
    this.setState({ shortComb })
  }
  hangleShtDefChange(value) {
    var shortDef = this.state.shortDef
    shortDef[this.state.indexSht] = value
    this.setState({ shortDef })
  }
  handleShtIdxChange(indexSht) {
    this.setState({ indexSht })
  }
  handleLngIdxChange(indexLng){
    this.setState({indexLng})
  }
  handleLngCombChange(value){
    var longComb = this.state.longComb
    longComb[this.state.indexLng] = value
    this.setState({longComb})
  }
  handleLngDefChange(value){
    var longDef = this.state.longDef
    longDef[this.state.indexLng] = value
    this.setState({longDef})
  }
  render() {
    const indexSht = this.state.indexSht
    const indexLng = this.state.indexLng
    const indexSgl = this.state.indexSgl

    return (
      <div id="review">
        <Swipeable
          group={'single'}
          value={this.state.single[indexSgl]}
          length={this.state.single.length}
          index={indexSgl}
          onIndexChange={this.handleSglIdxChange}
          opacity={'show'}
        />

        <br></br>
        <Swipeable
          group={'short'}
          type={'combination'}
          value={this.state.shortComb[indexSht]}
          length={this.state.shortComb.length}
          index={indexSht}
          onTextChange={this.handleShtCombChange}
          onIndexChange={this.handleShtIdxChange}
          opacity={'show'}
        />
        <Swipeable
          group={'short'}
          type={'definition'}
          value={this.state.shortDef[indexSht]}
          length={this.state.shortDef.length}
          index={indexSht}
          onTextChange={this.hangleShtDefChange}
          onIndexChange={this.handleShtIdxChange}
          opacity={'hide'}
        />
        <Swipeable
          group={'long'}
          type={'combination'}
          value={this.state.longComb[indexLng]}
          length={this.state.longComb.length}
          index={indexLng}
          onTextChange={this.handleLngCombChange}
          onIndexChange={this.handleLngIdxChange}
          opacity={'show'}
        />
        <Swipeable
          group={'long'}
          type={'definition'}
          value={this.state.longDef[indexLng]}
          length={this.state.longDef.length}
          index={indexLng}
          onTextChange={this.handleLngDefChange}
          onIndexChange={this.handleLngIdxChange}
          opacity={'hide'}
        />
      </div>

    )
  }
}