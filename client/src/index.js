import React from 'react';
import ReactDOM from 'react-dom';
import App from './react-App';
import Hzwriter from './components/hzwriter'
import * as serviceWorker from './serviceWorker';
import './style/main.scss'

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Hzwriter />, document.getElementById('react-draw'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();