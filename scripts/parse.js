'use strict';

function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};


//Char Units Object Collection
var units = []
const pchar = 0, pShort = 1, pLong = 2, pPron = 3, pDef = 4, pDefS = 5, pDefL = 6;
var learnedId = 0;
$.ajax({
  method: 'GET',
  url:'./chinese_chars2.csv',
}).done(function(data){
  var parsed = csvToArray(data);
  
  for(let i=0; i<parsed.length-1; i++){
    var unit = {combinations: [], definitions: [] };    
    parsed[i][pShort] = parsed[i][pShort].split(',');
    parsed[i][pLong] = parsed[i][pLong].split('。');
    parsed[i][pDefS] = parsed[i][pDefS].split(',');
    parsed[i][pDefL] = parsed[i][pDefL].split(',');
    
    unit.id = i;
    unit.char = parsed[i][pchar];
    if(unit.char.includes('*'))
    if(parsed[i][pDef].trim().length===0 ) { //char hasn't been learned yet
      units.push(unit);
      continue;
    }
    //learned characters
    unit.learnedId = learnedId++;
    //char level assignement and clean _
    if(unit.char.includes('*') && !unit.char.includes('**')){
      unit.char = unit.char.replace(/\*/g,'')
      unit.level = 1;
    } 
    else if(unit.char.includes('**')){
      unit.char = unit.char.replace(/\**/g,'')
      unit.level = 2;
    }
    else if(unit.char.includes('$')){
      unit.char = unit.char.replace(/\$/g,'')
      unit.level = 3;
    } else {
      unit.level = 0;
    }
      
    unit.pronunciation = parsed[i][pPron];
    unit.definitions.single = parsed[i][pDef];
    unit.combinations.short = parsed[i][pShort];
    unit.combinations.long = parsed[i][pLong];
    unit.definitions.short = parsed[i][pDefS];
    unit.definitions.long = parsed[i][pDefL]; 
    units.push(unit);
    
    /**
     * todo: google search should work, for null empty or space strings
     * Extract categories for dificulty and make all one big json object( or    why to keep it in 2 objects?? nosql?? honor db certificate?? lol)
     *      In nosql embeeded documents and linking is used to avoid repetition
     * Is it better to have a combinantion
     *      
     */
    //
    //
  }
  console.log(units);
})

// $.get('./chinese_chars2.csv', function(data){

//  var parsed = csvToArray(data)
//  //console.log(parsed);
//  for(let i=0; i<parsed.length-1; i++){
//     if(parsed[i][1]=='') continue;
//     console.log(parsed[i][1].split(','));
//     //console.log(parsed[i][2].split('。'));
    
//  }
 
// })

