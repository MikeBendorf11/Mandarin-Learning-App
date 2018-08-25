var units = []; //the collection

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

window.onload = function () {
  var unit = { combinations: [], definitions: [] };
  //to be send to nextIdx by event handler
  var index = { defNChar: 0, shortComb: 0, longComb: 0 }
  var aDefNchar = []; //mix def and char for hints
  var target;
  var mapLongDef = new Map(); //used by Hint bttn long-short comb-def
  var mapShortDef = new Map();

  //load handwriting tool and hide the result box
  enableHWIme('txt_word');
  var hwimeResult = document.querySelector('.mdbghwime-result');
  hwimeResult.setAttribute('style', 'display:none');

  //There is no dbStorage for this browser, create a new priority db 
  function waitForScript(script) {
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
          //console.log(units[0].definitions.single);
          loadChar(95)
          /**Process:
           * remember last level reviewed
           * 
           */
          //TODO:
          //prevTarget issue: clicking on any part of pinReviewCont messes up with hint dipplay. Solution: keep track of active definition and create a map for combination definition match. Prototypes candidates?????
          //Db from scratch: Remove # after assigning consult
          //create index for learnedId(review all), 
          //create cookies for last char reviewed on levels 0 => 4 and consult
          //add search box and use char index on it, search on db instead?
        })
      )
  }

  //changes the view for specific char
  function setConsultAndLevel(id) {
    var checkbox = document.querySelector("#pinReviewCont input");

    if (units[id].consult == true)
      checkbox.setAttribute('checked', '');
    else
      checkbox.removeAttribute('checked');
    var level = units[id].level;
    for (let i = 0; i < 4; i++) {
      var select = document.querySelector('#oLevel' + i);
      if (level != i)
        select.removeAttribute('selected');
      else
        select.setAttribute('selected', '');
    }
  }

  function loadChar(id) {
    unit.id = units[id].id;
    unit.char = units[id].char;
    unit.pronunciation = units[id].pronunciation;
    unit.combinations.short = units[id].combinations.short;
    unit.combinations.long = units[id].combinations.long;
    unit.definitions.single = units[id].definitions.single;
    unit.definitions.short = units[id].definitions.short;
    unit.definitions.long = units[id].definitions.long;
    setConsultAndLevel(id);
    //for btnHint
    aDefNchar = [];
    aDefNchar.push('char: ' + unit.char);
    aDefNchar = aDefNchar.concat(unit.definitions.single);
    $("#pinyin").html(unit.pronunciation);
    pDefNchar.innerHTML = '&nbsp;';
    pComb.innerHTML = '&nbsp;';
    pHint.innerHTML = '&nbsp;';
  }

  //handwriting panel events
  btnHintDraw.onclick = function () {
    toggleDiv(hwimeResult);
  }

  //review tab events
  pinReviewCont.onclick = function (event) {
    target = event.target;

    if (target.id == 'rLevel') {
      var lv = $("#rLevel").val();
      setCookie('rLevel', lv)
      //jump onto next char of level using rLevelId cookies
    }
    //buttons pressed
    else if (target.id == 'btnNext') {
      
      var lv = $("#rLevel").val();
      //use current id to start search of next char of same level
      for (i = nextIdx(unit.id, units); i < units.length; i++)
        if (units[i].level == lv) {
          loadChar(i);
          setCookie('rLevel' + lv + 'Id', i);
          console.log(unit.id);
          break;
        }
    }
    else if (target.id == 'btnHint') {
      pDefNchar.innerHTML = aDefNchar[index.defNChar];
      index.defNChar = nextIdx(index.defNChar, aDefNchar);
    }
    else if (target.id == 'btnCombS') {
      showCombDef(
        unit.combinations.short[index.shortComb],
        unit.definitions.short[index.shortComb],
        pComb,
        pHint
      )
      index.shortComb = nextIdx(index.shortComb, unit.combinations.short);
    }
    else if (target.id == 'btnCombL') {
      showCombDef(
        unit.combinations.long[index.longComb], 
        unit.definitions.long[index.longComb],  
        pComb, 
        pHint
      )
      index.longComb = nextIdx(index.longComb, unit.combinations.long);
    }
    else if (target.id == 'btnCombH') {
      pHint.style.visibility = 'visible';
    }//end of btnCombH
    
    //Ion icon to container button event chaining
    target.id == 'ionNext' ? btnNext.click(): null;
    target.id == 'ionHint' ? btnHint.click(): null;
    target.id == 'ionCombShort' ? btnCombS.click(): null;
    target.id == 'ionCombLong' ? btnCombL.click(): null;
    target.id == 'ionCombHint' ? btnCombH.click(): null;
    
  }


  function showCombDef(combination, definition, display1, display2){
    console.log(combination);
    console.log(definition);

    //display the combination if any
    if(!combination || combination.trim =='') {
      display1.innerHTML = 'add content ...';
      display2.innerHTML = '&nbsp;';
      return;
    }
    else display1.innerHTML = combination;
    
    //call google translate or display db def
    if(!definition || combination.trim =='')
      gTranslate(combination.trim()).then(data=>display2.innerHTML=data);
    else display2.innerHTML = definition;

    //set ready to show with hint button
    display2.style.visibility = 'hidden'; 
  }
  async function gTranslate(phrase) {
    var url = 'https://translation.googleapis.com/language/translate/v2' + '?q=' + encodeURIComponent(phrase) + '&target=EN' + '&key=AIzaSyA8Hupp7Bd9QuzN5yMOoWJfD_hTZQDvrPo'
    console.log(url);
    var xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.open('POST', url);
      xhr.onload = function () {
        if (this.status == 200) {
          data = JSON.parse(this.responseText);
          var img = '<img src="./images/GoogleTranslate1.png" width="30" height="25"/>';
          resolve(img + data.data.translations[0].translatedText);
        }
      }
      xhr.onerror = function () {
        console.log('error: ' + this.status);
        reject(img + 'you are offline!');
      }
      xhr.send();
    })
  }
  //roulette: switches to next array index or starts over
  function nextIdx(index, array) {
    if (index + 1 > array.length - 1) return 0;
    else return index + 1;
  }
  //hides element if display property is already set
  function toggleDiv(element) {
    if (element.style.display == 'none')
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

