import React from 'react'
import {observer} from 'mobx-react'
import { FormGroup, Input, Label } from 'reactstrap'
import '../style/search.scss'

@observer
class Search extends React.Component{
  constructor(props){
    super(props)

  }
  changeValue(e, type2){
    //console.log(e.target.value)
    this.props.unit.char.hanzi = e.target.value
  }

  capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  render(){
    var char = this.props.unit.char
    var short = this.props.unit.short
    var long = this.props.unit.long

    return(

      <FormGroup className="search">
        <fieldset >
          <legend>Character(s): </legend>
          <div style={{display:'flex', flexWrap:'wrap'}}>
            {this.props.lesson.charTypes2.map((value, i)=> 
              <div style={{flex:1, flexShrink:1}}>
                <span className='search__label'>{this.capitalize(value)}: </span>
                <Input 
                  className="search__input-char"
                  key={i}
                  defaultValue={char[value]} 
                  onChange={(e)=>{this.changeValue(e, value)}}
                />
              </div>
              )}      
          </div>
          
        </fieldset>
        
        <fieldset>
          <legend>Short Combination(s): </legend>
            <div style={{ width: '100%', display: 'flex'}}>
            {this.props.lesson.combTypes2.map((value)=> 
              {if (value!='pinyin'){ return (
                <div style={{flex: 1}}>
                  <span>{this.capitalize(value)}: </span><br></br>
                  {short[value].map((v,i)=>
                    <Input 
                    className="search__input-comb-sh"
                    key={i}
                    defaultValue={short[value][i]} 
                    onChange={(e)=>{this.changeValue(e, value)}}
                    />            
                  )}
                </div>
              )}}
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>Long Combination(s): </legend>
            <div>
                {long['hanzi'].map((v,i)=>
                <div>
                  <span>Hz: </span>
                  <Input 
                    className="search__input-comb-lg"
                    defaultValue={long['hanzi'][i]} 
                    onChange={(e)=>{this.changeValue(e, 'hanzi')}}
                  /><br></br>
                  <span style={{paddingLeft: '25px'}}>Fg: </span>
                  <Input 
                    className="search__input-comb-lg"
                    defaultValue={long['figurative'][i]} 
                    onChange={(e)=>{this.changeValue(e, 'figurative')}}
                  />            
                </div>
                  
                )}
              </div>
        </fieldset> 
        
            
          
        
           
      </FormGroup>

    )
  }
}



export default Search