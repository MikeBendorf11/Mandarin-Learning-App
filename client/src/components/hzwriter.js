import React from 'react';
import MdBrush from 'react-ionicons/lib/IosBrushOutline'
import MdClose from 'react-ionicons/lib/MdClose'
import MdRfresh from 'react-ionicons/lib/MdRefresh'
import MdNext from 'react-ionicons/lib/IosArrowForward'
import MdPrev from 'react-ionicons/lib/IosArrowBack'
import Modal from 'react-modal';
import HanziWriter from 'hanzi-writer'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };
  
export default class hzwriter extends React.Component {
    constructor(props) {
        super(props)
        this.writer = {}
        this.char = ''
        this.state = {
            showModal: false,
            charIndex: 0,
            charLength: 0,
            pinyin: []
        };
    }
    handleNextChar=()=>{
        
        let charIndex =  this.state.charIndex+1 > this.state.charLength-1 ? 0 : this.state.charIndex +1
        this.setState({ charIndex }, 
            ()=>this.quizChar(this.char[this.state.charIndex])
        )
        
    }
    handlePrevChar=()=>{
        
        let charIndex = this.state.charIndex-1 < 0 ? this.state.charLength-1 :    this.state.charIndex-1 
        this.setState({ charIndex },
            ()=>this.quizChar(this.char[this.state.charIndex])
        )
        
    }
    quizChar=(char)=>{
        
        window.loadStroke(char)
        .then(data=>{
            //redraw char to delete the preious quiz result
            document.getElementById('hzchar').innerHTML = '<line x1="0" y1="0" x2="230" y2="230" stroke="#DDD" /><line x1="230" y1="0" x2="0" y2="230" stroke="#DDD" /><line x1="115" y1="0" x2="115" y2="230" stroke="#DDD" /><line x1="0" y1="115" x2="230" y2="115" stroke="#DDD" />'
            this.writer = HanziWriter.create('hzchar', 
            char, {
                charDataLoader: (char, onComplete)=>{
                   onComplete(data)
                },
                width: 230,
                height: 230,
                showCharacter: false,
                showOutline: false,
                showHintAfterMisses: 2,
                padding: 5
            })
            this.writer.quiz()
        })
    }
    handleOpenModal=()=>{
        this.char = window.unit.char
        let pinyin = window.unit.pronunciation.split(',')
        this.setState({ 
            showModal: true, 
            charLength: this.char.length,
            pinyin: pinyin
        });
        this.quizChar(this.char[this.state.charIndex])
    }
    handleReload=()=>{
        this.writer.quiz()
    }
    handleCloseModal=()=>{
        this.setState({
            showModal: false,
            charIndex: 0,
            charLength: 0,
            pinyin: []
        })
    }
    
    
    render() {

        return (
            <div>
                <Modal
                    isOpen={this.state.showModal}
                    appElement={document.createElement('div')}
                    contentLabel="Example Modal"
                    style={customStyles}
                >
                    <div className='writer__button__container'>
                        <button
                            className='form-control'
                            onClick={this.handleReload}
                        >
                            <MdRfresh/>
                        </button>
                        
                        <button
                            className="form-control"
                            onClick={this.handlePrevChar}>
                            <MdPrev />
                        </button>
                        <button
                            className="form-control"
                            onClick={this.handleNextChar}>
                            <MdNext />
                        </button> 
                        <button
                            className="form-control"
                            onClick={this.handleCloseModal}>
                            <MdClose />
                        </button>     
                        
                    </div>
                    {this.state.pinyin[this.state.charIndex]}<br></br>
                    
                    <svg id="hzchar" xmlns="http://www.w3.org/2000/svg" width="230" height="230" >
                    <line x1="0" y1="0" x2="230" y2="230" stroke="#DDD" />
                    <line x1="230" y1="0" x2="0" y2="230" stroke="#DDD" />
                    <line x1="115" y1="0" x2="115" y2="230" stroke="#DDD" />
                    <line x1="0" y1="115" x2="230" y2="115" stroke="#DDD" />
                    </svg>
                            

                </Modal>
                <button
                    className="form-control"
                    onClick={this.handleOpenModal}>
                    <MdBrush />
                </button>
            </div>


        )
    }
}