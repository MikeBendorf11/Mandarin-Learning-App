import React from 'react';
import IosBug from 'react-ionicons/lib/IosBug'
export default class Miner extends React.Component {
  handleClick=()=>{
    var worker = new Worker('../util/worker.js')
    worker.postMessage(window.unit.char)
  }

  
  
  render(){
    return(
      <button onClick={this.handleClick}>
        <IosBug/>
      </button>
    )
  }
}
