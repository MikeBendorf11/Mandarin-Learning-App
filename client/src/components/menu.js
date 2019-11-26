import React from 'react';
import SearchIcon from 'react-ionicons/lib/MdSearch'
import DrawIcon from 'react-ionicons/lib/MdBrush'
import IchachaIcon from 'react-ionicons/lib/MdBook' //for ichacha
import MdbgIcon from '../images/mdbg-small.png'
import CpodIcon from '../images/cpod-small.png'
import '../style/review.scss'
import Swipe from '../util/swipe'


export default class Example extends React.Component{
  constructor(props){
    super(props)
    this.hideMenu = this.hideMenu.bind(this)
    this.showMenu = this.showMenu.bind(this)
  }
  componentDidMount(){
    this.overlay = document.querySelector('.menu-overlay')
    this.element = document.querySelector('.menu-overlay>div')
    var swipe = new Swipe(this.element)
    swipe.onLeft(()=>{
      this.hideMenu()
      //document.body.requestFullscreen();
    })
    swipe.onRight(()=>{
      this.showMenu()
    })
    swipe.onUp(()=>{})
    swipe.onDown(()=>{})
    swipe.addListener()

  }
  hideMenu(){
    this.element.classList.remove('menu-open')
    this.overlay.style.visibility = 'hidden'
  }
  showMenu(){
    this.element.classList.add('menu-open')
    this.overlay.style.visibility = 'visible'
  }
  render(){
    return(


    <div className={'menu-overlay'} onClick={
      ()=>this.hideMenu()    }>
      <div className={'menu-container'} >

      <div className={'menu-item-container'} onClick={()=>{
        /*var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
          requestFullScreen.call(docEl);
        }
        else {
          cancelFullScreen.call(doc);
        }*/
      }}>
        <DrawIcon color={'#495057'} className={'menu__icon'}/>
        <span className={'menu__description'}>Draw</span>
      </div>
      <div className={'menu-item-container'}>
        <SearchIcon color={'#495057'} className={'menu__icon'}/>
        <span className={'menu__description'}>Search</span>
      </div>
      <div className={'menu-item-container'}>
        <img src={MdbgIcon} className={'menu__icon'}/>
        <span className={'menu__description'}>Mdbg</span>
      </div>
      <div className={'menu-item-container'}>
        <IchachaIcon color={'#495057'}  className={'menu__icon'}/>
        <span className={'menu__description'}>Ichacha</span>
      </div>
      <div className={'menu-item-container'}>
        <img src={CpodIcon} className={'menu__icon'}/>
        <span className={'menu__description'}>Cpod</span>
      </div>

      </div>
    </div>


    )
  }
}
