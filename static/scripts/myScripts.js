
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
  pushChanges(unit);
}
/**
 * Get rid of HTML tags when copy pasting content into comb and def
 */
function parseInput(element) {
  var reg = /<[^>]*>/g;
  //or change regex.exec prototype 
  var myArray = reg.exec(element.innerHTML);
  while (myArray !== null) {
    //console.log(element.innerHTML);
    element.innerHTML = element.innerHTML.replace(reg, '')
    myArray = reg.exec(element.innerHTML);
  }
  return element.innerHTML;
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

//Used when adding data to db and updating the interface
function pushChanges(displayUnit) {
  var u = displayUnit;
  units[u.id].char = u.char;
  units[u.id].consult = u.consult;
  units[u.id].learnedId = u.learnedId;
  units[u.id].level = u.level;
  units[u.id].pronunciation = u.pronunciation;
  units[u.id].combinations.short = u.combinations.short;
  units[u.id].combinations.long = u.combinations.long;
  units[u.id].definitions.single = u.definitions.single;
  units[u.id].definitions.short = u.definitions.short;
  units[u.id].definitions.long = u.definitions.long;
  saveToIndexedDB(dbName, units[u.id]);
  fetch('/save', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST', 
    body: JSON.stringify(units[u.id])})
  .then(res=>{return res.json()})
  .then(data=>console.log(data))
}

/**
   * Updated when the cloud button is pressed
   */
function externalStorage(uri) {
  var uri = getCookie('uri');
  var myData = JSON.stringify(units)
  console.log(uri);
  //uri = uri.slice(8,uri.length-2)
  $.ajax({
    url: uri,
    type: "PUT",
    data: myData,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      alert('Success: ' + data.status +
      ', ' + data.statusText)
    },
    error: function (data) {
      alert("Error : " + data.status +
        ', ' + data.statusText);
    }
  });
}
function checkCookies() {
  if (!getCookie('rLevel')) {
    setCookie('rLevel', 0);
  }
  for (i = 0; i < 5; i++) {
    if (!getCookie(`rLevel${i}Id`))
      setCookie(`rLevel${i}Id`, 0)
  }
}

function ping(ip, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback(true);

        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback(true, e);
            }

        };
        this.start = new Date().getTime();
        this.img.src = ip + "/?cachebreaker="+ new Date().getTime();;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback(false);
            }
        },100);
    }
}

window.onload = function () {

  (function herokuWakeUp(){
    setTimeout(function () {
      ping('http://thechapp.herokuapp.com', result=>console.log('herokuOnline',result))
      herokuWakeUp()
    }, 60000);
  })()

  var index;
  checkDbExists(dbName).then(res => {
    if (res) {//exist 

      checkCookies();
      // $('#mLoading').modal('show'); 
      // setTimeout(()=>{ 
      //   if(units.length>0)
      //     $('#mLoading').modal('hide'); 
      // },5000)
      var level = parseInt(getCookie('rLevel'));
      var levelId = parseInt(getCookie(`rLevel${level}Id`));
      loadFromIndexedDB(dbName)
        .then(db => { units = db })
        .catch(() => { //db is corrupted delete cookies, db and start from scratch
          var cookies = document.cookie.split(";");

          for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
          var del = window.indexedDB.deleteDatabase(dbName)
          del.onerror((err) => console.log(err))
          del.onsuccess(() => {
            document.write('Loading the app ...')
            setTimeout(() => {
              window.location.reload()  
            }, 5000);
          })
        })
        .then(() => {
          
          loadChar(levelId, level)
          //console.log(unit)
          //to be send to nextIdx by event handler

          //load handwriting tool and hide the result box
          enableHWIme('txt_word');
          //handwriting panel events
          $(document.body).on('click', '#btnHintDraw', function () {
            hwimeResult = document.querySelector('.mdbghwime-result');
            toggleDiv(hwimeResult);
          })


          unitState = new UnitState();
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
            //setTimeout(() => window.scrollTo(0, 0), 10);
          });
          width = window.innerWidth;
          height = window.innerHeight;

          var mySVG = ''
          if (!ttg) {
            mySVG = `
            <svg width="25cm" height="40cm" version="1.1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
          
            <text x="0" y="0" font-size="100" style="fill:grey">
              <tspan x="0" dy="1.2em">条内容的合法性负责，名誉权等）</tspan>
              <tspan x="0" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="0" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="0" dy="1.2em">由用户自行负责解决与第三人的</tspan>
              <tspan x="0" dy="1.2em">，纠纷，并承担相应的法律责任。</tspan>
              <tspan x="0" dy="1.2em">用户使用“本人词条编辑服务”提交的内</tspan>
              <tspan x="0" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="0" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="0" dy="1.2em">由用户自行负责解决与第三人的</tspan>
            </text>
          
            <text x="60" y="70" font-size="20" style="fill:red;">
              <tspan x="60" dy="1.2em">条内容的合法性负责，名誉权等）</tspan>
              <tspan x="60" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="60" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="60" dy="1.2em">由用户自行负责解决与第三人的</tspan>
              <tspan x="60" dy="1.2em">，纠纷，并承担相应的法律责任。</tspan>
              <tspan x="60" dy="1.2em">用户使用“本人词条编辑服务”提交的内</tspan>
              <tspan x="60" dy="1.2em">符合百科词条编辑的内容规范和</tspan>
              <tspan x="60" dy="1.2em">通过本服务提交的词条版本将根据</tspan>
              <tspan x="60" dy="1.2em">百科一般要求和方式进行审核</tspan>
              <tspan x="60" dy="1.2em">容需强制规则。</tspan>
              <tspan x="60" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
              <tspan x="60" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
            </text>
          
              <text x="500" y="100" style="fill:red;">
              <tspan x="500" dy="1.2em">条内容的合法性负责，名誉权等）</tspan>
              <tspan x="500" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="500" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="500" dy="1.2em">由用户自行负责解决与第三人的</tspan>
              <tspan x="500" dy="1.2em">，纠纷，并承担相应的法律责任。</tspan>
              <tspan x="500" dy="1.2em">用户使用“本人词条编辑服务”提交的内</tspan>
              <tspan x="500" dy="1.2em">符合百科词条编辑的内容规范和</tspan>
              <tspan x="500" dy="1.2em">通过本服务提交的词条版本将根据</tspan>
              <tspan x="500" dy="1.2em">百科一般要求和方式进行审核</tspan>
              <tspan x="500" dy="1.2em">容需强制规则。</tspan>
              <tspan x="500" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
              <tspan x="500" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
            </text>
                <text x="500" y="400" style="fill:red;">
              <tspan x="500" dy="1.2em">条内容的合法性负责，名誉权等）</tspan>
              <tspan x="500" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="500" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="500" dy="1.2em">由用户自行负责解决与第三人的</tspan>
              <tspan x="500" dy="1.2em">，纠纷，并承担相应的法律责任。</tspan>
              <tspan x="500" dy="1.2em">用户使用“本人词条编辑服务”提交的内</tspan>
              <tspan x="500" dy="1.2em">符合百科词条编辑的内容规范和</tspan>
              <tspan x="500" dy="1.2em">通过本服务提交的词条版本将根据</tspan>
              <tspan x="500" dy="1.2em">百科一般要求和方式进行审核</tspan>
              <tspan x="500" dy="1.2em">容需强制规则。</tspan>
              <tspan x="500" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
              <tspan x="500" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
            </text>
              <text x="100" y="500" style="fill:red;">
              <tspan x="100" dy="1.2em">条内容的合法性负责，名誉权等）</tspan>
              <tspan x="100" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="100" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="100" dy="1.2em">由用户自行负责解决与第三人的</tspan>
              <tspan x="100" dy="1.2em">，纠纷，并承担相应的法律责任。</tspan>
              <tspan x="100" dy="1.2em">用户使用“本人词条编辑服务”提交的内</tspan>
              <tspan x="100" dy="1.2em">符合百科词条编辑的内容规范和</tspan>
              <tspan x="100" dy="1.2em">通过本服务提交的词条版本将根据</tspan>
              <tspan x="100" dy="1.2em">百科一般要求和方式进行审核</tspan>
              <tspan x="100" dy="1.2em">容需强制规则。</tspan>
              <tspan x="100" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
              <tspan x="100" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
            </text>
              <text x="0" y="820" font-size="20" style="fill:red;">
              <tspan x="0" dy="1.2em">条内容的合法性负责，名誉权等）</tspan>
              <tspan x="0" dy="1.2em">如果您提供的任何内容涉嫌侵犯第三</tspan>
              <tspan x="0" dy="1.2em">人合法权益（包括但不限于著作权、</tspan>
              <tspan x="0" dy="1.2em">由用户自行负责解决与第三人的</tspan>
              <tspan x="0" dy="1.2em">，纠纷，并承担相应的法律责任。</tspan>
              <tspan x="0" dy="1.2em">用户使用“本人词条编辑服务”提交的内</tspan>
              <tspan x="0" dy="1.2em">符合百科词条编辑的内容规范和</tspan>
              <tspan x="0" dy="1.2em">通过本服务提交的词条版本将根据</tspan>
              <tspan x="0" dy="1.2em">百科一般要求和方式进行审核</tspan>
              <tspan x="0" dy="1.2em">容需强制规则。</tspan>
              <tspan x="0" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
              <tspan x="0" dy="1.2em">签署承诺函，对发表的内容的真实</tspan>
            </text>
          </svg>`;
          }
          var Base64 = {

            // private property
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

            // public method for encoding
            , encode: function (input) {
              var output = "";
              var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
              var i = 0;

              input = Base64._utf8_encode(input);

              while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                  enc3 = enc4 = 64;
                }
                else if (isNaN(chr3)) {
                  enc4 = 64;
                }

                output = output +
                  this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                  this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
              } // Whend 

              return output;
            } // End Function encode 


            // public method for decoding
            , decode: function (input) {
              var output = "";
              var chr1, chr2, chr3;
              var enc1, enc2, enc3, enc4;
              var i = 0;

              input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
              while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                  output = output + String.fromCharCode(chr2);
                }

                if (enc4 != 64) {
                  output = output + String.fromCharCode(chr3);
                }

              } // Whend 

              output = Base64._utf8_decode(output);

              return output;
            } // End Function decode 


            // private method for UTF-8 encoding
            , _utf8_encode: function (string) {
              var utftext = "";
              string = string.replace(/\r\n/g, "\n");

              for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);

                if (c < 128) {
                  utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                  utftext += String.fromCharCode((c >> 6) | 192);
                  utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                  utftext += String.fromCharCode((c >> 12) | 224);
                  utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                  utftext += String.fromCharCode((c & 63) | 128);
                }

              } // Next n 

              return utftext;
            } // End Function _utf8_encode 

            // private method for UTF-8 decoding
            , _utf8_decode: function (utftext) {
              var string = "";
              var i = 0;
              var c, c1, c2, c3;
              c = c1 = c2 = 0;

              while (i < utftext.length) {
                c = utftext.charCodeAt(i);

                if (c < 128) {
                  string += String.fromCharCode(c);
                  i++;
                }
                else if ((c > 191) && (c < 224)) {
                  c2 = utftext.charCodeAt(i + 1);
                  string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                  i += 2;
                }
                else {
                  c2 = utftext.charCodeAt(i + 1);
                  c3 = utftext.charCodeAt(i + 2);
                  string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                  i += 3;
                }

              } // Whend 

              return string;
            } // End Function _utf8_decode 

          }
          document.getElementById('container').style.background =
            `
          linear-gradient(-40deg,
          rgba(252,229,148,.65) 18%,
          rgba(252,229,148,.95) 52%,
          rgba(255,255,255,1) 79%),
          url('data:image/svg+xml;base64,${Base64.encode(mySVG)}') -61% -25% /70% 
          `
          //tests

          //document.querySelector('[href="#searchCont"]').click();
          // seaIpt.value = "什么"
          // seaIpt.focus()
          //setTimeout(() => revSent.click(), 1000);
          //Load Frames and hide secondary ones
          if (!ttg) {
            iframe1.setAttribute('src', 'https://eng.ichacha.net/m')
            iframe2.setAttribute('src', 'https://www.mdbg.net/chinese/dictionary#');
            iframe3.setAttribute('src', 'https://chinesepod.com/dictionary/english-chinese/');
            iframe2.style.display = 'none';
            iframe3.style.display = 'none';
          }
        })

    } else {//no cookies, create uri cookie and storage from json
      $.post('/load', data=>{
        units= data
        storageFromBlank(this.dbName).then(()=>{
            setCookie('rLevel', 0);
            setCookie('rLevel0Id', 0)
            setCookie('rLevel1Id', 0)
            setCookie('rLevel2Id', 0)
            setCookie('rLevel3Id', 0)
            setCookie('rLevel4Id', 0)
            document.write('Loading the app ...')
            setTimeout(() => {
              window.location.reload()  
            }, 5000);
        })
      })
    }
  })


  function loadChar(id, reviewLevel) {
    unit.id = units[id].id;
    unit.consult = units[id].consult;
    unit.learnedId = units[id].learnedId;
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
    //console.log(aDefNchar);
    pinyin.style.color = 'transparent';
    //pinyin.innerHTML = unit.pronunciation
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
  function updatePopover() {
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
  reviewCont.onclick = function (event) {
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
        target.innerHTML = ""
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
    pushChanges(unit);
    updatePopover();
  })
  $(document.body).on('click', '#cbConsult', function (event) {
    var vl = cbConsult.checked;
    console.log('Consult: ' + event.target.value);
    unit.consult = vl;
    pushChanges(unit);
    updatePopover();
  })
  $(document.body).on('click', (event) => {
    if (event.target.id != 'pinyin' &&
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
}//ends window.onload
//testing
var ttg = false;
/**Sentence Review */
var loaded = false;
var wait = 0;

revSent.onclick = () => {
  pronReview.style.display = 'none'
  sentReview.style.display = 'block';
  if (!loaded) {
    units.forEach(unit => {
      var sentences = unit.combinations.long;
      var definitions = unit.definitions.long;
      if (sentences) {
        for (i = 0; i < sentences.length; i++) {
          if (sentences[i]) {
            var group = document.createElement('details');
            var aComb = document.createElement('summary');
            var aDef = document.createElement('span');
            aComb.innerHTML = `<b>${unit.char}:</b> <span> ${sentences[i]}</span>`;
            if (typeof (definitions[i]) == 'undefined' || !definitions[i]) {
              aDef.innerHTML = ''
              aComb.addEventListener('click', (event) => {
                console.log(event.target)
                console.log(event.target.parentNode.children)
                var target = event.target;
                gTranslate(target.innerHTML)
                  .then(data => {
                    target.parentNode.parentNode.children[1].innerHTML = data;
                  })
                  .catch(data => {
                    target.parentNode.parentNode.children[1].innerHTML = data;
                  })
              })

            } else {
              aDef.innerHTML = definitions[i];
            }
            group.appendChild(aComb);
            group.appendChild(aDef);
            sentReview.appendChild(group);
          }
        }
      }
    })
    loaded = true;
  }
}
revPron.onclick = () => {
  sentReview.style.display = 'none';
  pronReview.style.display = 'block';
}


async function gTranslate(phrase) {
  //  console.log('here');
  if (!phrase) return new Promise(res => res(''));
  
  return new Promise((resolve, reject) => {
    resolve('----')
    reject('----')
  })
}

//Search events
var seaIdx = 0; //for chars with 2+ pronunciations
var results = []; //for chars with 2+ pronunciations

//typing in the serach box
seaIpt.oninput = () => {
  if (!seaIpt.value.trim()) return;

  findChar(dbName, seaIpt.value).then(result => {
    clearSeaDisplay();
    results = result;
    if (results[seaIdx].learnedId == undefined) { //new char
      prepareResults(); //clear undefs
    }
    displaySearch(result, 0)
  })
}

//magnifier icon: db has 2 def results per char
ionSea.onclick = () => {
  if (results.length == 0) return; //only 1 result
  seaIdx = nextIdx(seaIdx, results);
  //console.log(seaIdx);
  clearSeaDisplay();
  displaySearch(results, seaIdx);
}

var lastNewChar = 0; //id
//plus sign: get a the next unknown char
ionNew.onclick = () => {
  //getLearned();
  for (var i = lastNewChar; i < units.length; i++) {
    if (!units[i].pronunciation) {
      lastNewChar = units[i].id + 1;
      clearSeaDisplay();
      seaIpt.value = units[i].char;
      results = [];
      results.push(units[i]);
      break;
    }
  }
  prepareResults();
  displaySearch(results, 0);
}
ionSave.onclick = () => {
  externalStorage();
  //alert('Cloud updated')
}
/**
 * Get rid of undefined values when dealing with new chars
 * Prepares the search results to be added to db when focusout
 */
function prepareResults() {
  results[seaIdx].learnedId = getLearned() + 1;
  results[seaIdx].level = 3;
  results[seaIdx].combinations.short = [''];
  results[seaIdx].combinations.long = [''];
  results[seaIdx].definitions.long = [''];
  results[seaIdx].definitions.short = [''];
  if (results[seaIdx].char.length > 1) {
    results[seaIdx].definitions.single = ['', ''];
  } else {
    results[seaIdx].definitions.single = [''];
  }
}
//handlers for search paragraph events
function checkSeaChanges(event) {
  var elem = event.target;
  var numb = parseInt(elem.id.replace(/^[^0-9]+/, ''), 10);
  var content = parseInput(elem);
  if ( //known chars
    elem.id == 'seaChar' &&
    content != results[seaIdx].char
  ) { results[seaIdx].char = content }
  else if (
    elem.id == 'sDef0' &&
    content != results[seaIdx].definitions.single[0]
  ) { results[seaIdx].definitions.single[0] = content }
  else if (
    elem.id == 'sDef1' &&
    content != results[seaIdx].definitions.single[1]
  ) { results[seaIdx].definitions.single[1] = content }
  else if (
    elem.id == 'seaPron' &&
    content != results[seaIdx].pronunciation
  ) { results[seaIdx].pronunciation = content; }
  else if (
    elem.id.includes('senComb') &&
    content != results[seaIdx].combinations.long[numb]
  ) {
    var lgth = results[seaIdx].combinations.long.length;
    //console.log(lgth + " " + numb);
    results[seaIdx].combinations.long[numb] = content;
    lgth - 1 == numb ? //last member of array? increase size
      results[seaIdx].combinations.long.push('') : null;
  }
  else if (
    elem.id.includes('expComb') &&
    content != results[seaIdx].combinations.short[numb]
  ) {
    var lgth = results[seaIdx].combinations.short.length;
    results[seaIdx].combinations.short[numb] = content;
    lgth - 1 == numb ?
      results[seaIdx].combinations.short.push('') : null;
  }
  else if (
    elem.id.includes('senDef') &&
    content != results[seaIdx].definitions.long[numb]
  ) { results[seaIdx].definitions.long[numb] = content; }
  else if (
    elem.id.includes('expDef') &&
    content != results[seaIdx].definitions.short[numb]
  ) { results[seaIdx].definitions.short[numb] = content; }
  else {
    console.log('no matching paragraph, or no changes');
  }
  clearSeaDisplay();
  displaySearch(results, seaIdx);
  pushChanges(results[seaIdx]);
  //console.log(results[seaIdx]);
}

seaLevel.onchange = () => {
  var lv = $('#seaLevel').val();
  results[seaIdx] ? results[seaIdx].level = parseInt(lv) : null;
}
seaConsult.onclick = () => {
  var vl = seaConsult.checked;
  results[seaIdx] ? results[seaIdx].consult = vl : null;
} //end of search event handlers

/**
 * Get last learnedId, to be used when adding a char
 */
function getLearned() {
  var learnedId = 0;
  units.forEach((v, i, a) => {
    if (v.learnedId && learnedId < v.learnedId) {
      learnedId = v.learnedId;
    }
  })
  return learnedId;
}
/**
 * Get's rid of tags and their contents
 */
function parseHtmlContent(element) {
  var dirty = element.innerHTML;
  var clean = dirty.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, "");
  element.innerHTML = clean;
  return element.innerHTML;
}
//when searching multiple times
function clearSeaDisplay() {
  $('#seaLevel').val(0);
  seaConsult.checked = false;
  seaChar.innerHTML = '';
  seaPron.innerHTML = '';
  seaDef.innerHTML = '';
  seaSen.innerHTML = '';
  seaExp.innerHTML = '';
}

/** 
 * Creates and displays either short of long combs and defs
 */
function buildCombDef(combsArr, defsArr, display) {
  var radical = ''
  display == seaSen ? radical = 'sen' : radical = 'exp';

  var count = 0;
  combsArr.forEach((v, i) => {
    var comb = document.createElement('span');
    comb.id = radical + 'Comb' + i;
    comb.setAttribute('contenteditable', 'true')
    comb.classList.add('seaPs');
    comb.addEventListener('focusin', () => parseHtmlContent(comb));
    comb.addEventListener('focusout', checkSeaChanges);
    var def = document.createElement('span');
    def.id = radical + 'Def' + i;
    def.setAttribute('contenteditable', 'true')
    def.classList.add('seaPs');
    def.addEventListener('focusin', () => parseInput(def));
    def.addEventListener('focusout', checkSeaChanges);
    if (v == '') { //placeholder for empty combs
      comb.innerHTML = `<x>${count = count + 1}. _________</x>${combsArr[i]}`;
      //comb.innerHTML =  `<x>${count=count+1}. _________</x>`;
    } else {
      comb.innerHTML = `<x>${count = count + 1}. </x>${combsArr[i]}`;
    }
    if (defsArr[i]) { //is there a def
      def.innerHTML = `${defsArr[i]}`
    } else { //no? then translate
      gTranslate(combsArr[i])
        .then(data => {
          def.innerHTML = data;
        })
        .catch(data => def.innerHTML = data)
    }
    display.appendChild(comb);
    display.appendChild(def);
  });
}
/**
 * for one and 2 char single defs
 */
function buildSingleDef(singleArr, display) {
  singleArr.forEach((v, i, a) => {
    var sDef = document.createElement('span');
    sDef.id = 'sDef' + i;
    sDef.setAttribute('contenteditable', 'true');
    sDef.classList.add('seaPs');
    sDef.addEventListener('focusin', () => parseInput(sDef));
    sDef.addEventListener('focusout', checkSeaChanges);
    sDef.innerHTML = v;
    display.appendChild(sDef);
  });
}
function displaySearch(aResult, index) {
  seaChar.innerHTML = aResult[index].char;
  seaPron.innerHTML = aResult[index].pronunciation;
  if (!aResult[index].pronunciation) { //it's new char     
    $('#seaLevel').val(3);
    if (aResult[index].char.length > 1) { //2 char unit
      gTranslate(aResult[index].char[0])
        .then(data1 => gTranslate(aResult[index].char[1])
          .then(data2 => gTranslate(aResult[index].char)
            .then(data3 => {
              var reg = /<[^>]*>/g; //clean gtranslate icon
              data1 = data1.replace(reg, '')
              data2 = data2.replace(reg, '')
              buildSingleDef([`(${data1} ,${data2})`, `${data3}`], seaDef);
            })))
        .catch(data => {

          buildSingleDef([data], seaDef);
        })
    } else {
      gTranslate(aResult[index].char)
        .then(data => {
          buildSingleDef([data], seaDef);
        })
        .catch(data => {
          //console.log("here")
          buildSingleDef([data], seaDef);
        })
    }
    buildCombDef([''], [''], seaExp);
    buildCombDef([''], [''], seaSen);

  } else { //it's known char
    $('#seaLevel').val(aResult[index].level);
    seaConsult.checked = aResult[index].consult;
    let tempDef = aResult[index].definitions.single;
    if (tempDef == "") {
      gTranslate(aResult[index].char)
        .then(data => {
          buildSingleDef([data], seaDef);
        })
        .catch(data => {
          buildSingleDef([data], seaDef);
        })
    } else {
      buildSingleDef(tempDef, seaDef);
    }
    buildCombDef(
      aResult[index].combinations.short,
      aResult[index].definitions.short,
      seaExp,
    )
    buildCombDef(
      aResult[index].combinations.long,
      aResult[index].definitions.long,
      seaSen,
    )
  }
  //either way make content editable
  seaChar.setAttribute('contenteditable', 'true');
  seaChar.addEventListener('focusout', checkSeaChanges)
  seaPron.setAttribute('contenteditable', 'true');
  seaPron.addEventListener('focusout', checkSeaChanges)
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

//roulette: switches to next array index or starts over
function nextIdx(index, array) {
  if (index + 1 > array.length - 1) return 0;
  else return index + 1;
}
function prevIdx(index, array) {
  if (index - 1 < 0) return array.length - 1;
  else return index - 1;
}
//handler for iframes display
links.onclick = (event) => {
  switch (event.target) {
    case (ichachaLink):
      showFrame(1);
      break;
    case (mdbgLink):
      showFrame(2);
      break;
    case (cpodLink):
      showFrame(3);
      break;
    // case(yebrLink):
    //   showFrame(5);
    //   break;
  }
}

//clear frames except the one calling this method
function showFrame(number) {
  for (i = 1; i < 4; i++) {
    var fr = document.getElementById('iframe' + i);
    if (i == number) {
      fr.style.display = 'block';
      continue;
    }
    fr.style.display = 'none'
  }
}
