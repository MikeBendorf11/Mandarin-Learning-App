var units = []; //the collection
var unit = { combinations: [], definitions: [] };

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
var unitState;
function UnitState() {}
UnitState.prototype.locate = function (element, index, target) {
  this.char = this.sing0 = this.sing1 = false; 
  if(element.id == 'pDefNchar'){
    switch(index){
      case 0: 
      this.char = true; break;
      case 1: 
      this.sing0 = true; break;
      case 2: 
      this.sing1 = true; break;   
    }
  }
}
UnitState.prototype.update = function(content){
  var result;
  if(this.char)
    result = unit.char;
  if(this.sing0)
    result = unit.definitions.single[0]
  if(this.sing1)
    result = unit.definitions.single[1]
  
  //delete html double or single spaces
  var match = new RegExp('(&nbsp;)').exec(content)
  
  if(match){
    match.forEach(element =>content = content.replace(element, ''));
    match.forEach(element =>content = content.replace(element, ''));
  }
    
  console.log(result +' vs ' + content );
  if(result.trim() != content.trim()){
    console.log('push to db');
    return true;
  }
  else{
    console.log('do nothing');
    return false;
  }
}
window.onload = function () {
  
  //to be send to nextIdx by event handler
  var index = { defNChar: 0, shortComb: 0, longComb: 0 }
  var aDefNchar = []; //mix def and char for hints
  var dbName = 'priorityDb';

  //load handwriting tool and hide the result box
  enableHWIme('txt_word');
  var hwimeResult = document.querySelector('.mdbghwime-result');
  hwimeResult.setAttribute('style', 'display:none');
  //handwriting panel events
  btnHintDraw.onclick = function () {
    toggleDiv(hwimeResult);
  }

  //determines db existence and creation
  //starts from id 0 or checks cookies for last review level and id
  function AppState(dbStatus) {
    self = this;
    this.get = function () {
      return new Promise(resolve => {
        if (dbStatus) { //db exists
          self.rLevel = parseInt(getCookie('rLevel'))
          self.charId = parseInt(getCookie('rLevel' + self.rLevel + 'Id'))
        } else {
          parseCSV();
          storageFromBlank(dbName);
          self.charId = 0;
          self.rLevel = 0;
          setCookie('rLevel', self.rLevel);
          setCookie('rLevel0Id', 0)
          setCookie('rLevel1Id', 0)
          setCookie('rLevel2Id', 0)
          setCookie('rLevel3Id', 0)
          setCookie('rLevel4Id', 0)
        }
        loadFromIndexedDB(dbName).then(db => {
          units = db;
          resolve(self)
        })
      })
    }
  }
  checkDbExists(dbName).then(res => {
    var appState = new AppState(res);
    return appState.get()
  }).then(state => {
    loadChar(state.charId, state.rLevel)
    unitState = new UnitState();
  })


  //TODO:
  //add search box and use char index on it, search on db instead?
  function loadChar(id, reviewLevel) {
    unit.id = units[id].id;
    unit.char = units[id].char;
    unit.pronunciation = units[id].pronunciation;
    unit.combinations.short = units[id].combinations.short;
    unit.combinations.long = units[id].combinations.long;
    unit.definitions.single = units[id].definitions.single;
    unit.definitions.short = units[id].definitions.short;
    unit.definitions.long = units[id].definitions.long;

    var checkbox = document.querySelector("#pinReviewCont input");

    if (units[id].consult == true)
      checkbox.setAttribute('checked', '');
    else
      checkbox.removeAttribute('checked');

    //set character level
    for (let i = 0; i < 4; i++) {
      var sLevel = document.querySelector('#sLevel' + i);
      if (units[id].level != i)
        sLevel.removeAttribute('selected');
      else
        sLevel.setAttribute('selected', '');
    }

    //set review level
    for (let i = 0; i < 5; i++) {
      rLevel = document.querySelector('#rLevel' + i);
      if (i != reviewLevel)
        rLevel.removeAttribute('selected');
      else
        rLevel.setAttribute('selected', '');
    }

    //for btnHint
    aDefNchar = [];
    aDefNchar.push(unit.char);
    aDefNchar = aDefNchar.concat(unit.definitions.single);
    $("#pinyin").html(unit.pronunciation);
    pDefNchar.innerHTML = '&nbsp;';
    pComb.innerHTML = '&nbsp;';
    pHint.innerHTML = '&nbsp;';
  }

  function currentChar(level) {
    var cookieId = parseInt(getCookie('rLevel' + level + 'Id'))
    //not first load 
    if (level == 4 && units[cookieId].consult) {
      loadChar(cookieId, level)
    }
    //should be first load (ex. all levels zeroed)
    else if (level == 4 && !units[cookieId].consult) {
      for (let i = cookieId, j = 0; j <= units.length * 2; i = nextIdx(i, units)) {
        if (units[i].consult) {
          loadChar(i, level)
          setCookie('rLevel' + level + 'Id', i);
          break;
        }
        if (j == units.length * 2) {
          alert('No character assigned to level' + level);
          break;
        }
      }
    }
    //non consult chars
    //not first load 
    else if (level != 4 && units[cookieId].level == level) {
      loadChar(cookieId, level)
    }
    //should be first load (ex. all levels zeroed)
    else {
      for (let i = cookieId, j = 0; j <= units.length * 2; i = nextIdx(i, units)) {
        if (units[i].level == level) {
          loadChar(i, level)
          setCookie('rLevel' + level + 'Id', i);
          break;
        }
        if (j == units.length * 2) {
          alert('No character assigned to level' + level);
          break;
        }
      }
    }
  }
  function getNextChar(level) {
    var cookieId = parseInt(getCookie('rLevel' + level + 'Id'))
    if (level == 4) {
      let i = cookieId + 1, j = 0;
      while (i < units.length, j <= units.length * 2) {
        if (units[i].consult) {
          loadChar(i, level)
          setCookie('rLevel' + level + 'Id', i);
          break;
        }
        if (j == units.length * 2) {
          alert('No character assigned to level' + level);
          break;
        }
        i = nextIdx(i, units)
      }
    } else {
      for (let i = cookieId + 1, j = 0; i < units.length, j <= units.length * 2; i = nextIdx(i, units)) {
        if (units[i].level == level) {
          loadChar(i, level)
          setCookie('rLevel' + level + 'Id', i);
          break;
        }
        if (j == units.length * 2) {
          alert('No character assigned to level' + level);
          break;
        }
      }
    }


  }

  //initiated under loadChar()
  


  //review tab events
  pinReviewCont.onclick = function (event) {
    var target = event.target;

    if (target.id == 'rLevel') {
      var lv = $("#rLevel").val();
      setCookie('rLevel', lv)
      currentChar(lv);
    }
    //buttons pressed
    else if (target.id == 'btnNext') {
      var lv = $("#rLevel").val();
      getNextChar(lv);
      pDefNchar.setAttribute('contenteditable', 'false')
    }
    else if (target.id == 'btnHint') {
      if(aDefNchar[index.defNChar]) 
        pDefNchar.setAttribute('contenteditable', 'true')
      
      pDefNchar.innerHTML = aDefNchar[index.defNChar];
      unitState.locate(pDefNchar, index.defNChar);
      index.defNChar = nextIdx(index.defNChar, aDefNchar);
      
    }
    else if (target.id == 'btnCombS') {
      //unitState.locate(
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
    }
    else if (target.id == 'pComb') {
      if (target.innerHTML == 'add content ...')
        target.innerHTML = "&nbsp;"
    }
    //Ion icon to container button event chaining
    target.id == 'ionNext' ? btnNext.click() : null;
    target.id == 'ionHint' ? btnHint.click() : null;
    target.id == 'ionCombShort' ? btnCombS.click() : null;
    target.id == 'ionCombLong' ? btnCombL.click() : null;
    target.id == 'ionCombHint' ? btnCombH.click() : null;

  }

  //content change/save events
  /**
   * save to changes to units
   * set an app state for remote saving on interval?
   * push to localDb
   */
 
  pComb.onfocusout = function () {

    //make sure there is always space convention
    if (pComb.innerHTML == '')
      this.innerHTML = '&nbsp;'

    //content has changed
    if (pComb.innerHTML.length > 3) {
      console.log('here');
      //units[unit.id].combinations.

    }
    // console.log(index.defNChar);
    // console.log(index.longComb);
    // console.log(index.shortComb);
    // console.log(unit.id);

  }
  
  
  //clear space for easier editing
  pDefNchar.onfocus = function(){
    if (this.innerHTML == "&nbsp;")
      this.innerHTML = '';
  }
  pComb.onfocus = function () {
    if (pComb.innerHTML == "&nbsp;")
      this.innerHTML = '';
  }
  pHint.onfocus = function(){
    if (this.innerHTML == "&nbsp;")
      this.innerHTML = '';
  }
  
  pDefNchar.onfocusout = function () {
    unitState.update(this.innerHTML)
    if (this.innerHTML == '')
      this.innerHTML = '&nbsp;'
  }
  pComb.onfocusout = function () {
    if (this.innerHTML == '')
      this.innerHTML = '&nbsp;'
  }
  pHint.onfocusout = function () {
    if (this.innerHTML == '')
      this.innerHTML = '&nbsp;'
  }
  



  function showCombDef(combination, definition, display1, display2) {
    //display the combination if any
    if (!combination || combination.trim == '') {
      display1.innerHTML = 'add content ...';
      display2.innerHTML = '&nbsp;';
      return;
    }
    else display1.innerHTML = combination;

    //call google translate or display db def
    if (!definition || combination.trim == '')
      gTranslate(combination.trim()).then(data => display2.innerHTML = data);
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


