import Swipe from './Swipe'

/** 
 * Represents an element that can be moved away from the screen
 * 
 * @param [data.Horizontal] -> new char or new sentence
 * @param [data.Vertical] -> show char def single, pronunciation
 *                          -> show short or long def
 * @returns the next/previous data
 * */

export default class Roulette{
  constructor(data, element){
    this.data = data
    this.element = element
    this.data.indexHor = data.indexVer = 0
    var swiper = new Swipe(element)

    
    swiper.onLeft(()=> {
      this.data.indexHor = nextLocation(
        this.data.indexHor, 
        this.data.horizontal.length
        )
      return this.data.horizontal[this.data.indexHor]
    })

    swiper.onRight(()=>{
      this.data.indexHor = previousLocation(
        this.data.indexHor,
        this.data.horizontal.length
      )
      return this.data.horizontal[this.data.indexHor]
    })
      
    swiper.onUp(()=>{
      this.data.indexVer = nextLocation(
        this.data.indexVer,
        this.data.vertical.length
      )
      return this.data.vertical[this.data.indexVer]
    })

    swiper.onDown(()=>{
      this.data.indexVer = previousLocation(
        this.data.indexVer,
        this.data.vertical.length
      )
      return this.data.vertical[this.data.indexVer]
    })
      
    swiper.addListener();
  }
  
  //roulette array locations
  nextLocation(index, length) {
    if (index + 1 > length - 1) return 0
    else return index + 1
  }
  previousLocation(index, length) {
    if (index - 1 < 0) return length - 1
    else return index - 1
  }


}