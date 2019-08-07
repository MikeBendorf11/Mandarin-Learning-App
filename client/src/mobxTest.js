
import {observer} from 'mobx-react'
import React from 'react'

//https://medium.com/@shoaibbhimani1392/getting-started-with-mobx-82306df92d90
//todo actions

const Counter = observer(props => (
<div>
    {props.appState.count}
    <div>
        <button onClick={props.appState.incCount}> + </button>
        <button onClick={props.appState.decCount}> - </button>
    </div>
</div>
))

export default Counter