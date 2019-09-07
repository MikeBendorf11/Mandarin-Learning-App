import React from 'react'
import {observer} from 'mobx-react'
import { FormGroup, Input, Label } from 'reactstrap'

@observer
class Search extends React.Component{
  constructor(props){
    super(props)

  }
  changeValue(e, type2){
    //console.log(e.target.value)
    this.props.unit.char.hanzi = e.target.value
  }
  render(){
    var char = this.props.unit.char
    var short = this.props.unit.short
    var long = this.props.unit.long

    return(

      <FormGroup className="search">
        <Label>Character(s): </Label>
        <Input defaultValue={this.props.unit.char.hanzi} onChange={(e)=>{this.changeValue(e, 'hanzi')}}/>
           
      </FormGroup>

    )
  }
}

export default Search