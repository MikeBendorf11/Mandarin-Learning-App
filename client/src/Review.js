import React from 'react';
import Swipeable from './util/Swipeable'

var unit = JSON.parse(`{"id":12,"learnedId":12,"level":1,"consult":true,"char":"就","pronunciation":"jiù","combinations":{"short":["就要"," 成就", ""],"long":["#,因为就要下雨了","这不是什么大不了的成就",""]},"definitions":{"short":["will"," achieve",""],"long":[""],"single":["at once, just, go "]}}`)

export default class Review extends React.Component {
  constructor(props) {
    super(props);
    this.handleShtCombChange = this.handleShtCombChange.bind(this)
    this.hangleShtDefChange = this.hangleShtDefChange.bind(this)
    this.handleIndexChange = this.handleIndexChange.bind(this)

    this.state = {
      shortComb: unit.combinations.short,
      shortDef: unit.definitions.short,
      index: 0
    }
  }
  handleShtCombChange(shortComb) {
    this.setState({shortComb})
  }
  hangleShtDefChange(shortDef){
    this.setState({shortDef})
  }
  handleIndexChange(index){
    this.setState({index})
  }
  render() {
    const index = this.state.index
    return (
      <div id="review">
        <Swipeable
          group={'short'}
          value={this.state.shortComb[index]}
          length={this.state.shortComb.length}
          index={index}
          onTextChange={this.handleShtCombChange}
          onIndexChange={this.handleIndexChange}
        />
        <Swipeable
          group={'short'}
          value={this.state.shortDef[index]}
          length={this.state.shortDef.length}
          index={index}
          onTextChange={this.hangleShtDefChange}
          onIndexChange={this.handleIndexChange}
        />
      </div>

    )
  }
}