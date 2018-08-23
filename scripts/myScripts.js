  //Char Units Object Collection
  var units = [];

  function getCookie(name, defaultValue) {
    defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue;
    var re = new RegExp(name + "=([^;]+)"); // the () is capture group
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : defaultValue;
  }
  
  function setCookie(name, value) {
    var date = new Date();
    date.setTime((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365);
    document.cookie = escape(name) + '=' + escape(value) + ';expires=' + date.toGMTString();
  }

window.onload = function(){
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

  //There is no dbStorage for this browser, create a new priority db 
  function waitForScript(script){
    return new Promise(resolve => {
      script.onload = () => resolve();
    });
  }; 
  if (!getCookie('dbRecurrenceCreated')) {
    //load csv parser
    var script = document.createElement("script");
    script.src = "./scripts/parseCSV.js"
    document.head.appendChild(script);

    //create idexedDB script
    script = document.createElement('script');
    script.src = './scripts/storageFromBlank.js';
    document.head.appendChild(script);
  } else {
    var script = document.createElement('script');
    script.src = './scripts/storageFunctions.js'
    document.head.appendChild(script)
    waitForScript(script)
    .then(() => loadFromIndexedDB()
    .then(result => {
        units = result;
        console.log(units);
        //TODO:
        //aDefNchar has to be set to null for evety char
        //create cookies for last char reviewed on levels 0 => 4 and consult
        //create new db index for learnedId display
        //create checkbox for unit.consult
        //add search box and use char index on it, search on db instead?
        toggleButtons(buttons)
      })
    )
  }



  //handwriting panel events
  btnHintDraw.onclick = function(){
    toggleDiv(hwimeResult);
  }

  //review tab events
  pinReviewCont.onclick = function (event) {
    let prevTarget = target;
    target = event.target;

    if (target.id == 'btnNext') {
      // $.getJSON('char-data-ex.json', function (data) {
      //   unit.id = data.id;
      //   unit.char = data.char;
      //   unit.pronunciation = data.pronunciation;
      //   unit.combinations.short = data.combinations.short;
      //   unit.combinations.long = data.combinations.long;
      //   unit.definitions.single = data.definitions.single;
      //   unit.definitions.short = data.definitions.short;
      //   unit.definitions.long = data.definitions.long;
      //   aDefNchar.push(unit.char);
      //   aDefNchar.push(unit.definitions.single);
      //   $("#pinyin").html(unit.pronunciation);
      // });
      // //loaded data: enable the rest of the buttons
      // toggleButtons(buttons)
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

