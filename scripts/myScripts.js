window.onload = () => {
  enableHWIme('txt_word'); //handwriting tool
  var unit = { combinations: [], pronunciation: [], definitions: [] };

  //to be send to nextIdx by event handler
  var index = { defNChar: 0, shortComb: 0, longComb: 0 }
  var aDefNchar = []; //mix def and char for hints
  var target;

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
    }

    //buttons pressed
    if (target.id == 'btnHintCh') {
      if (unit.id == null) return;
      pDefNchar.innerHTML = aDefNchar[index.defNChar];
      index.defNChar = nextIdx(index.defNChar, aDefNchar);
    }
    if (target.id == 'btnCombS') {
      if (unit.id == null) return;
      pComb.innerHTML = unit.combinations.short[index.shortComb];
      index.shortComb = nextIdx(index.shortComb, unit.combinations.short);
    }
    if (target.id == 'btnCombL') {
      if (unit.id == null) return;
      pComb.innerHTML = unit.combinations.long[index.longComb];
      index.longComb = nextIdx(index.longComb, unit.combinations.long);
    }
    if (target.id == 'btnCombH') {
      if (unit.id == null) return;
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

    //display definition for corresponding combination
    function loadData(index, combination, definition, element) {
      //next # is 0 after last index of array
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
            element.innerHTML = data.data.translations[0].translatedText;
          }
        }
        xhr.onerror = function () {
          console.log('error: ' + this.status);
        }
        xhr.send();
      }
    }
    //roulette: switches to next array index or starts over
    function nextIdx(index, array) {
      if (unit.id == null) return;
      if (index + 1 > array.length - 1) return 0;
      else return index + 1;
    }
  }
  //todo: prototype string method?
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

