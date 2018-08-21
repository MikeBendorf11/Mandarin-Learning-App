window.onload = () => {
  //todo: load char automatically, now next bttn has to be pressed
  var buttons = [btnHintCh, btnCombS, btnCombL, btnCombH]
  toggleButtons(buttons); 
  var unit = { combinations: [], definitions: [] };
  //to be send to nextIdx by event handler
  var index = { defNChar: 0, shortComb: 0, longComb: 0 }
  var aDefNchar = []; //mix def and char for hints
  var target;//used by prevTarget

  //load handwriting tool and hide the result box
  enableHWIme('txt_word'); 
  var hwimeResult = document.querySelector('.mdbghwime-result');
  hwimeResult.setAttribute('style', 'display:none');

  //load csv parser
  var script = document.createElement("script"); // Make a script DOM node
  script.src = "./scripts/parse.js"
  document.head.appendChild(script); 

  //handwriting panel events
  btnHintDraw.onclick = function(){
    toggleDiv(hwimeResult);
  }

  //review panel events
  pinReviewCont.onclick = function (event) {
    let prevTarget = target;
    target = event.target;

    if (target.id == 'btnNext') {
      $.getJSON('char-data-ex.json', function (data) {
        unit.id = data.id;
        unit.char = data.char;
        unit.pronunciation = data.pronunciation;
        unit.combinations.short = data.combinations.short;
        unit.combinations.long = data.combinations.long;
        unit.definitions.single = data.definitions.single;
        unit.definitions.short = data.definitions.short;
        unit.definitions.long = data.definitions.long;
        aDefNchar.push(unit.char);
        aDefNchar.push(unit.definitions.single);
        $("#pinyin").html(unit.pronunciation);
      });
      //loaded data: enable the rest of the buttons
      toggleButtons(buttons)
    }

    //buttons pressed
    if (target.id == 'btnHintCh') {
      pDefNchar.innerHTML = aDefNchar[index.defNChar];
      index.defNChar = nextIdx(index.defNChar, aDefNchar);
    }
    if (target.id == 'btnCombS') {
      pComb.innerHTML = unit.combinations.short[index.shortComb];
      index.shortComb = nextIdx(index.shortComb, unit.combinations.short);
    }
    if (target.id == 'btnCombL') {
      pComb.innerHTML = unit.combinations.long[index.longComb];
      index.longComb = nextIdx(index.longComb, unit.combinations.long);
    }
    if (target.id == 'btnCombH') {
      if (prevTarget.id == 'btnCombS') {
        loadData(
          index.shortComb,
          unit.combinations.short,
          unit.definitions.short,
          pHint
        );
      }
      if (prevTarget.id == 'btnCombL') {
        loadData(
          index.longComb,
          unit.combinations.long,
          unit.definitions.long,
          pHint
        );
      }

    }//end of btnCombH


    //display definition for the corresponding combination
    function loadData(index, combination, definition, element) {
      //after the last index of array, next # is 0 
      idx = index == 0 ? combination.length - 1 : index - 1;
      if (definition[idx] != null)
        element.innerHTML = definition[idx];
      else {
        //google translate
        var url = 'https://translation.googleapis.com/language/translate/v2' + '?q=' + combination[idx] + '&target=EN' + '&key=AIzaSyA8Hupp7Bd9QuzN5yMOoWJfD_hTZQDvrPo'
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onload = function () {
          if (this.status == 200) {
            data = JSON.parse(this.responseText);
            var img = '<img src="./images/GoogleTranslate1.png" width="30" height="25"/>';
            element.innerHTML =img + data.data.translations[0].translatedText;
          }
        }
        xhr.onerror = function () {
          console.log('error: ' + this.status);
        }
        xhr.send();
      }
    }
  }
  //roulette: switches to next array index or starts over
  function nextIdx(index, array) {
    if (index + 1 > array.length - 1) return 0;
    else return index + 1;
  }
  //todo: prototype string method?
  function toggleButtons(elements){
    elements.forEach((value,index)=>{
      if(elements[index].hasAttribute('disabled'))
      elements[index].removeAttribute('disabled');
      else
      elements[index].setAttribute('disabled','')
    })
  }
  //hides element if display property is already set
  function toggleDiv(element){ 
    if(element.style.display == 'none')
    element.style.display = 'block';
    else
    element.style.display = 'none';
  }
}
/*

{
  "data": {
    "translations": [
      {
        "translatedText": "An ideal",
        "detectedSourceLanguage": "zh-CN"
      }
    ]
  }
}
*/

