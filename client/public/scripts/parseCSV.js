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
function parseCSV() {
  return new Promise((res, rej)=> {
    const pChar = 0, pCsho = 1, pClon = 2, pPron = 3, pSing = 4, pDsho = 5, pDlon = 6;
    var learnedId = 0;
    $.ajax({
      method: 'GET',
      url: 'chinese_chars3_accents.csv',
    }).done(function (data) {
      var parsed = csvToArray(data);

      for (let i = 0; i < parsed.length - 1; i++) {
        var unit = { combinations: [], definitions: [] };

        //find boolean consult before splitting   
        unit.consult = parsed[i][pSing].includes('#') ||
          parsed[i][pCsho].includes('#') ||
          parsed[i][pClon].includes('#') ||
          parsed[i][pDsho].includes('#') ||
          parsed[i][pDlon].includes('#');

        //divide further into arrays
        parsed[i][pSing] = parsed[i][pSing].split(';');
        parsed[i][pCsho] = parsed[i][pCsho].split(',');
        parsed[i][pClon] = parsed[i][pClon].split('。');
        parsed[i][pDsho] = parsed[i][pDsho].split(',');
        parsed[i][pDlon] = parsed[i][pDlon].split(',');

        unit.id = i;
        unit.char = parsed[i][pChar];

        if (parsed[i][pPron].trim().length === 0) { //char hasn't been learned yet
          units.push(unit);
          continue;
        }

        //learned characters
        //char level assignment and cleanup
        if (unit.char.includes('*') && !unit.char.includes('**')) {
          unit.char = unit.char.replace(/\*/g, '');
          //console.log(unit.char);
          unit.level = 1;
        }
        else if (unit.char.includes('**')) {
          unit.char = unit.char.replace(/\**/g, '');
          // console.log(unit.char);
          unit.level = 2;
        }
        else if (unit.char.includes('$')) {
          unit.char = unit.char.replace(/\$/g, '');
          // console.log(unit.char);
          unit.level = 3;
        } else {
          unit.level = 0;
        }

        unit.learnedId = learnedId++;
        unit.pronunciation = parsed[i][pPron];
        unit.definitions.single = parsed[i][pSing];
        unit.combinations.short = parsed[i][pCsho];
        unit.combinations.long = parsed[i][pClon];
        unit.definitions.short = parsed[i][pDsho];
        unit.definitions.long = parsed[i][pDlon];

        // for learned chars add one more empty comb
        // helps with editing and saving content
        var lenCs = unit.combinations.short.length;
        var lenCl = unit.combinations.long.length;
        lenCs > 0 ? unit.combinations.short.push('') : null;
        lenCl > 0 ? unit.combinations.long.push('') : null;

        units.push(unit);
      }
      // console.log(units[110]);
      // console.log(units[111]);
      res();
    })
    .fail(rej)
  })

}

