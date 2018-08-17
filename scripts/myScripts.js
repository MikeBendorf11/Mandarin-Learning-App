window.onload = () => {
  enableHWIme('txt_word'); //handwriting tool
  var currentChar = {combinations:[], pronunciation:[], definitions:[]};

  $('#btnNext').click(function(){
    $.getJSON('char-data-ex.json', function(data){
      console.log(data);
      currentChar.id = data.id;
      currentChar.char = data.char;
      currentChar.pronunciation = data.pronunciation;
      currentChar.combinations.short = data.combinations.short;
      currentChar.combinations.long = data.combinations.long;
      currentChar.definitions.single = data.definitions.single;
      currentChar.definitions.short = data.definitions.short;
      currentChar.definitions.long = data.definitions.long;
      $("#pinyin").html(currentChar.pronunciation);
    });
  });
  var index = 0;
  $("#btnHintCh").click(function(){
    index = nextCharDef(index);
    
  });
  //Switches between 2 text hints, the character and its definition
  function nextCharDef(index){
    var pCharDef = $("#pCharDef");
    aCharDef = [];
    aCharDef.push(currentChar.char);
    aCharDef.push(currentChar.definitions.single);
    aCharDef.push('&nbsp;');
    pCharDef.html(aCharDef[index]);
    if(index == 2)
      return 0;
    else
      return index+1;
  }
  $("#btnCombS").click(function(){
    //$("#btnCombS>p").html()
  })
  function nextShort(){
    
  }
}


