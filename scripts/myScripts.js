var units = []; //the collection
var unit = { combinations: [], definitions: [] };
var aDefNchar = []; //mix def and char for hints
var dbName = 'priorityDb';

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
function UnitState() { }
/**Finds the paragraph related to unit member 
 * used by the app buttons on every click
*/
UnitState.prototype.locate = function (element, index) {
  this.char = this.sing0 = this.sing1 = false;
  if (element.id == 'pDefNchar') {
    switch (index) {
      case 0:
        this.char = true; break;
      case 1:
        this.sing0 = true; break;
      case 2:
        this.sing1 = true; break;
    }
  }
  else if (element.id == 'btnCombS') {
    this.sCombIdx = index;
    this.lCombIdx = null;
  }
  else if (element.id == 'btnCombL') {
    this.lCombIdx = index;
    this.sCombIdx = null;
  }
  // console.log('sCombIdx: ' + this.sCombIdx + ', lCombIdx:' + this.lCombIdx);
}
/**After comparing the content with the unit member, updates 
 * the unit, local db and remote db. 
 * Uses the mapping from locate(), 
 */
UnitState.prototype.update = function (element) {
  parseInput(element);
  var content = element.innerHTML;
  var unitMember;

  if (element.id == 'pDefNchar') {
    if (this.char) {
      unitMember = unit.char;
      if (this.compare(content, unitMember)) {
        unit.char = content;
      }
    }
    else if (this.sing0) {
      unitMember = unit.definitions.single[0];
      if (this.compare(content, unitMember)) {
        unit.definitions.single[0] = content;
      }
    }
    else if (this.sing1) {
      unitMember = unit.definitions.single[1];
      if (this.compare(content, unitMember)) {
        unit.definitions.single[1] = content;
      }
    }
    //update display array
    aDefNchar = [];
    aDefNchar.push(unit.char);
    aDefNchar = aDefNchar.concat(unit.definitions.single);
  }
  else if (element.id == 'pComb') {
    if (this.sCombIdx != null) {
      unitMember = unit.combinations.short[this.sCombIdx];
      if (this.compare(content, unitMember)) {
        unit.combinations.short[this.sCombIdx] = content;
        if (this.sCombIdx == unit.combinations.short.length - 1) {
          unit.combinations.short.push('');
          unit.definitions.short.push('');
          console.log('incremented comb and def short');
        }
      }
    }
    else if (this.lCombIdx != null) {
      unitMember = unit.combinations.long[this.lCombIdx];
      if (this.compare(content, unitMember)) {
        unit.combinations.long[this.lCombIdx] = content;
        if (this.lCombIdx == unit.combinations.long.length - 1) {
          unit.combinations.long.push('');
          unit.definitions.long.push('');
          console.log('incremented comb and def long');
        }
      }
    }
  }
  else if (element.id == 'pHint') {
    if (this.sCombIdx != null) {
      unitMember = unit.definitions.short[this.sCombIdx];
      if (this.compare(content, unitMember)) {
        unit.definitions.short[this.sCombIdx] = content;
        if (this.sCombIdx == unit.combinations.short.length - 1) {
          unit.combinations.short.push('');
          unit.definitions.short.push('');
          console.log('incremented comb and def short');
        }
      }
    }
    else if (this.lCombIdx != null) {
      unitMember = unit.definitions.long[this.lCombIdx];
      if (this.compare(content, unitMember)) {
        unit.definitions.long[this.lCombIdx] = content;
        if (this.lCombIdx == unit.combinations.long.length - 1) {
          unit.combinations.long.push('');
          unit.definitions.long.push('');
          console.log('incremented comb and def long');
        }
      }
    }
  }
  pushChanges();
}
/**
 * Get rid of HTML tags when copy pasting content into comb and def
 */
function parseInput(element){
  var reg = /<[^>]*>/g;
  //or change regex.exec prototype 
  var myArray = reg.exec(element.innerHTML);
  while (myArray !== null) {
    console.log(element.innerHTML);
    element.innerHTML = element.innerHTML.replace(reg, '')
    myArray = reg.exec(element.innerHTML);  
  }
}
UnitState.prototype.compare = function (content, unitMember) {
  console.log(unitMember + ' vs ' + content);
  if (unitMember.trim() != content.trim()) {
    console.log('push to db: ' + content);
    return true;
  }
  else {
    console.log('do nothing');
    return false;
  }
}

/**
 * determines db existence and creation, 
 * starts from id 0 or checks cookies for last review level and id
 */
function AppState(dbStatus) {
  self = this;
  this.get = function () {
    return new Promise(resolve => {
      if (dbStatus) { //db exists
        self.rLevel = parseInt(getCookie('rLevel'))
        self.charId = parseInt(getCookie('rLevel' + self.rLevel + 'Id'))
        loadFromIndexedDB(dbName).then(db => {
          units = db;
          resolve(self)
        })
      } else {
        console.log('here');
        parseCSV()
        .then(()=>storageFromBlank(dbName)
        .then(()=>{
          self.charId = 0;
          self.rLevel = 0;
          setCookie('rLevel', self.rLevel);
          setCookie('rLevel0Id', 0)
          setCookie('rLevel1Id', 0)
          setCookie('rLevel2Id', 0)
          setCookie('rLevel3Id', 0)
          setCookie('rLevel4Id', 0)
          loadFromIndexedDB(dbName).then(db => {
            units = db;
            resolve(self)
          })
        }))
      }
    })
  }
}
//Used when adding data to db and updating the interface
function pushChanges(){
  units[unit.id].char =unit.char ;
  units[unit.id].consult = unit.consult;
  units[unit.id].level = unit.level;
  units[unit.id].pronunciation = unit.pronunciation;
  units[unit.id].combinations.short = unit.combinations.short;
  units[unit.id].combinations.long = unit.combinations.long;
  units[unit.id].definitions.single = unit.definitions.single;
  units[unit.id].definitions.short = unit.definitions.short;
  units[unit.id].definitions.long = unit.definitions.long;
  saveToIndexedDB(dbName, units[unit.id]);
}
window.onload = function () {
  //to be send to nextIdx by event handler
  var index;
  //load handwriting tool and hide the result box
  enableHWIme('txt_word');
  //handwriting panel events
  $(document.body).on('click', '#btnHintDraw', function () {
    hwimeResult = document.querySelector('.mdbghwime-result');
    toggleDiv(hwimeResult);
  })

  checkDbExists(dbName).then(res => {
    var appState = new AppState(res);
    return appState.get()
  }).then(state => {
    loadChar(state.charId, state.rLevel)
    unitState = new UnitState();
  })

  function loadChar(id, reviewLevel) {
    unit.id = units[id].id;
    unit.consult = units[id].consult;
    unit.level = units[id].level;
    unit.char = units[id].char;
    unit.pronunciation = units[id].pronunciation;
    unit.combinations.short = units[id].combinations.short;
    unit.combinations.long = units[id].combinations.long;
    unit.definitions.single = units[id].definitions.single;
    unit.definitions.short = units[id].definitions.short;
    unit.definitions.long = units[id].definitions.long;

    //balancing comb->def empty array size
    var lenCs = unit.combinations.short.length;
    var lenCl = unit.combinations.long.length;
    if (lenCs > 0 && unit.definitions.short == '') {
      let a = [];
      for (let i = 0; i < lenCs; i++)
        a.push('')
      unit.definitions.short = a;
    }
    if (lenCl > 0 && unit.definitions.long == '') {
      let a = [];
      for (let i = 0; i < lenCl; i++)
        a.push('')
      unit.definitions.long = a;
    }
    updatePopover();
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
    index = { defNChar: 0, shortComb: 0, longComb: 0 }
    // console.log(aDefNchar);
    pinyin.style.color = 'transparent';
    $("#pinyin").html(unit.pronunciation);
    $(pinyin).animate({ color: 'black' }, 1000);
    pDefNchar.innerHTML = '&nbsp;';
    pComb.innerHTML = '&nbsp;';
    pHint.innerHTML = '&nbsp;';

    idDisplay.innerHTML = unit.id;
  }
  /**
   * Used by loadChar on load and popover click events
   */
  function updatePopover(){ 
    var sLevel = document.createElement('select');
    sLevel.setAttribute('id', 'sLvl');
    sLevel.classList.add('form-control-sm')
    for (let i = 0; i < 4; i++) {
      var option = document.createElement('option');
      option.setAttribute('value', i)
      if (units[unit.id].level != i) {
        option.removeAttribute('selected');
      } else {
        option.setAttribute('selected', '');
      }
      option.innerHTML = i;
      sLevel.appendChild(option);
    }
    //checkbox creation and attrs
    var cbConsult = document.createElement('input');
    cbConsult.setAttribute('id', 'cbConsult');
    cbConsult.setAttribute('type', 'checkbox');
    if (units[unit.id].consult == true) {
      cbConsult.setAttribute('checked', '')
    } else {
      cbConsult.removeAttribute('checked');
    }
    Object.assign(cbConsult.style, {
      width: '20px',
      height: '20px',
      position: 'relative',
      top: '5px'
    });
    //add to popover
    $(pinyin).popover();
    pinyin.setAttribute('data-content',
      '<span>Level: </span>' +
      sLevel.outerHTML +
      '<span>&nbsp;&nbsp;&nbsp; Consult: </span>' +
      cbConsult.outerHTML
    )
  }
  /*Update view functions: current, next and prev char */
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
      let i = nextIdx(cookieId, units), j = 0;
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
        i = nextIdx(i, units);
        j++;
      }
    } else {
      for (let i = nextIdx(cookieId, units), j = 0; i < units.length, j <= units.length * 2; i = nextIdx(i, units), j++) {
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
  function getPrevChar(level) {
    var cookieId = parseInt(getCookie('rLevel' + level + 'Id'))
    if (level == 4) {
      let i = prevIdx(cookieId, units), j = 0;
      while (i > 0, j <= units.length * 2) {
        if (units[i].consult) {
          loadChar(i, level)
          setCookie('rLevel' + level + 'Id', i);
          break;
        }
        if (j == units.length * 2) {
          alert('No character assigned to level' + level);
          break;
        }
        i = prevIdx(i, units);
        j++;
      }
    } else {
      for (let i = prevIdx(cookieId, units), j = 0; i > 0, j <= units.length * 2; i = prevIdx(i, units), j++) {
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


  rLevel.onchange = function (event) {
    var lv = event.target.value;
    setCookie('rLevel', lv)
    currentChar(lv);
  }

  //review tab events
  pinReviewCont.onclick = function (event) {
    var target = event.target;

    //buttons pressed
    if (target.id == 'btnNext') {
      var lv = $("#rLevel").val();
      getNextChar(lv);
      pDefNchar.setAttribute('contenteditable', 'false');
      pComb.setAttribute('contenteditable', 'false');
      pHint.setAttribute('contenteditable', 'false')
    }
    else if (target.id == 'btnPrev') {
      var lv = $("#rLevel").val();
      getPrevChar(lv);
      pDefNchar.setAttribute('contenteditable', 'false');
      pComb.setAttribute('contenteditable', 'false');
      pHint.setAttribute('contenteditable', 'false')
    }
    else if (target.id == 'btnHint') {
      if (aDefNchar[index.defNChar])
        pDefNchar.setAttribute('contenteditable', 'true')
      pDefNchar.style.color = 'transparent'
      pDefNchar.innerHTML = aDefNchar[index.defNChar];
      $(pDefNchar).animate({ color: '#007bff' }, 1000);
      unitState.locate(pDefNchar, index.defNChar);
      index.defNChar = nextIdx(index.defNChar, aDefNchar);

    }
    else if (target.id == 'btnCombS') {
      unitState.locate(btnCombS, index.shortComb);
      pComb.setAttribute('contenteditable', 'true');
      showCombDef(
        unit.combinations.short[index.shortComb],
        unit.definitions.short[index.shortComb],
        pComb,
        pHint
      );
      index.shortComb = nextIdx(index.shortComb, unit.combinations.short);
    }
    else if (target.id == 'btnCombL') {
      unitState.locate(btnCombL, index.longComb);
      pComb.setAttribute('contenteditable', 'true');
      pHint.setAttribute('contenteditable', 'false');
      showCombDef(
        unit.combinations.long[index.longComb],
        unit.definitions.long[index.longComb],
        pComb,
        pHint
      );
      index.longComb = nextIdx(index.longComb, unit.combinations.long);
    }
    else if (target.id == 'btnCombH') {
      pHint.style.color = 'transparent';
      pHint.style.visibility = 'visible';
      $(pHint).animate({ color: '#212529' }, 1000);
      pHint.setAttribute('contenteditable', true);
    }
    else if (target.id == 'pComb') {
      if (target.innerHTML == 'add content ...')
        target.innerHTML = "&nbsp;"
    }
    //Ion icon to container button event chaining
    target.id == 'ionNext' ? btnNext.click() : null;
    target.id == 'ionHint' ? btnHint.click() : null;
    target.id == 'ionPrev' ? btnPrev.click() : null;
    target.id == 'ionCombShort' ? btnCombS.click() : null;
    target.id == 'ionCombLong' ? btnCombL.click() : null;
    target.id == 'ionCombHint' ? btnCombH.click() : null;
  }
  
  $(document.body).on('change', '#sLvl', function (event) {
    var lv = $('#sLvl').val();
    console.log('level: ' + event.target.value);
    unit.level = lv;
    pushChanges();
    updatePopover();
  })
  $(document.body).on('click', '#cbConsult', function (event) {
    var vl = cbConsult.checked;
    console.log('Consult: ' + event.target.value);
    unit.consult = vl;
    pushChanges();
    updatePopover();
  })
  $(document.body).on('click', (event)=>{
    if(event.target.id != 'pinyin' && 
       event.target.id != 'sLvl' &&
       event.target.id != 'cbConsult')
       $(pinyin).popover('hide');
  });

  //content change/save events
  pDefNchar.onfocus = function () {
    //clear space for easier editing
    if (this.innerHTML == "&nbsp;")
      this.innerHTML = '';
  }
  pComb.onfocus = function () {
    if (pComb.innerHTML == "&nbsp;")
      this.innerHTML = '';
  }
  pHint.onfocus = function () {
    if (this.innerHTML == "&nbsp;")
      this.innerHTML = '';
  }

  pDefNchar.onfocusout = function () {
    //check for changes and update
    unitState.update(this);
    //reinsert space for design (if empty)
    if (this.innerHTML == '')
      this.innerHTML = '&nbsp;'
  }
  pComb.onfocusout = function () {
    unitState.update(this);
    if (this.innerHTML == '')
      this.innerHTML = '&nbsp;'
  }
  pHint.onfocusout = function () {
    unitState.update(this);
    if (this.innerHTML == '')
      this.innerHTML = '&nbsp;'
  }




  function showCombDef(combination, definition, display1, display2) {
    //display the combination if any
    display1.style.color = 'transparent';
    if (!combination || combination.trim() == '') {
      display1.innerHTML = 'add content ...';
      $(display1).animate({ color: '#007bff' }, 1000);
      display2.innerHTML = '&nbsp;';
      return;
    }
    else display1.innerHTML = combination;

    //call google translate or display db def
    if (!definition || combination.trim() == '' || definition.trim() == '') {
      gTranslate(combination.trim())
        .then(data => display2.innerHTML = data)
        .catch(data => display2.innerHTML = data);
      $('[data-toggle="tooltip"]').tooltip();
    }

    else display2.innerHTML = definition;

    //set ready to show with hint button
    display2.style.visibility = 'hidden';
    $(display1).animate({ color: '#007bff' }, 1000);
  }
  
  //roulette: switches to next array index or starts over
  function nextIdx(index, array) {
    if (index + 1 > array.length - 1) return 0;
    else return index + 1;
  }
  function prevIdx(index, array) {
    if (index - 1 < 0) return array.length - 1;
    else return index - 1;
  }
  //window events
  //same but runs on onload
  if (window.innerWidth < 651) {

    container.classList.add('tab-content');
    // var hwimeResult = document.querySelector('.mdbghwime-result');
    // hwimeResult.style.display = 'none';
  } else {
    container.classList.remove('tab-content');
  }

  $(".nav-tabs a").click(function () {
    $(this).tab('show');
    mdbgHwIme.adjustMdbgHwImeGridOffsets()
    setTimeout(() => window.scrollTo(0, 0), 30);
  });
  width = window.innerWidth;
  height = window.innerHeight;

  setTimeout(() => {
    
  }, 1000);
  
  // $('[href="#searchCont"]').click();


  
  
}//ends window.onload
async function gTranslate(phrase) {
//  console.log('here');
  if(!phrase) return new Promise(res => res(''));
  phrase = phrase.replace('#', '')//google doesn't like #
  
  var img = '<img src="images/GoogleTranslate1.png" width="30" height="25" alt="Google Translate" title="Google Translate"/>';
  var url = 'https://translation.googleapis.com/language/translate/v2' + '?q=' + encodeURIComponent(phrase) + '&target=EN' + '&key=AIzaSyA8Hupp7Bd9QuzN5yMOoWJfD_hTZQDvrPo'

  var xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.open('POST', url);
    xhr.onload = function () {
      if (this.status == 200) {
        data = JSON.parse(this.responseText);
        // console.log(data.data.translations[0].translatedText);
        resolve(img + data.data.translations[0].translatedText);
      }
    }
    xhr.onerror = function () {
      console.log('error: ' + this.status);
      reject(img + 'you are offline...');
    }
    xhr.send();
  })
}
seaIpt.oninput = () =>{
  if(!seaIpt.value.trim()) return;
  
  findChar(dbName, seaIpt.value).then(result=>{ 
    $('#seaLevel').val(0);
    seaConsult.checked = false;
    seaChar.innerHTML = '';
    seaPron.innerHTML = '';
    seaDef.innerHTML = '';
    seaSen.innerHTML = '';
    seaExp.innerHTML = '';
    result ? displaySearch(result): null;
  })
}

function displaySearch(input){
  $('#seaLevel').val(input.level);
    seaConsult.checked = input.consult;
    seaChar.innerHTML = input.char;
    seaPron.innerHTML = input.pronunciation;
    seaDef.innerHTML = input.definitions.single;

    var count = 0;
    input.combinations.short.forEach((v, i)=>{
      var exp = document.createElement('span');
      exp.id = 'exp' + i;
      var def = document.createElement('span');
      def.id = 'eDef' + i;
      exp.innerHTML =  `${count=count+1}. ${input.combinations.short[i]}`;

      if(input.definitions.short[i].trim()){ //is there a def
        def.innerHTML = `${input.definitions.short[i]}`
      } else { //no? then translate
        gTranslate(input.combinations.short[i])
        .then(data =>{
          def.innerHTML = data;
        })
      }
      seaExp.appendChild(exp);
      seaExp.appendChild(document.createElement('br'));
      seaExp.appendChild(def);
      seaExp.appendChild(document.createElement('br'));
    });
    count = 0;
    input.combinations.long.forEach((v, i)=>{
      var sen = document.createElement('span');
      sen.id = 'sen' + i;
      var def = document.createElement('span');
      def.id = 'sDef' + i;
      sen.innerHTML  = `${count=count+1}. ${input.combinations.long[i]}`

      if(input.definitions.long[i]){
        def.innerHTML = `${input.definitions.long[i]}`;
      } else {
        gTranslate(input.combinations.long[i])
        .then(data =>{
          def.innerHTML = data;
        })      
      }
      seaSen.appendChild(sen);
      seaSen.appendChild(document.createElement('br'));
      seaSen.appendChild(def);
      seaSen.appendChild(document.createElement('br'));
    }); 
}
var width, height;
function toggleDiv(element) {
  if (element.style.display == '') {
    element.style.display = 'none';
  }
  else if (element.style.display == 'none') {
    element.style.display = ''
  }
}
window.onresize = function () {
  mdbgHwIme.adjustMdbgHwImeGridOffsets()
  //android
  if (width != window.width) {
    var hwimeResult = document.querySelector('.mdbghwime-result');
    hwimeResult.style.display = 'none';
  }

  if (window.innerWidth < 651) {
    container.classList.add('tab-content');
  } else {
    container.classList.remove('tab-content');
  }
}

