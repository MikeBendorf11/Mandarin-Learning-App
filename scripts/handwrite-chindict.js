/*
 * MDBG free online Chinese-English dictionary JavaScript support file
 * 
 * Copyrights MDBG 2015
 */

// jQuery.fn.identify = function(prefix) {
//     var i = 0;
//     return this.each(function() {
//         if(this.id) return;
//         do { 
//             i++;
//             var id = prefix + '_' + i;
//         } while($('#' + id).length > 0);            
//         $(this).attr('id', id);            
//     });
// };

var mdbg = {};
var mdbgHwIme;

function enableHWIme(inputElementId) {

	var hideOnHwImeOpen = $('.hide-on-hwime-open');
	hideOnHwImeOpen.hide();
	
	var divHWImeButton = $('#hwime_on_' + inputElementId);
	divHWImeButton.hide();

	var divHWIme = $('#hwime_' + inputElementId);
	divHWIme.show();

	mdbgHwIme = new MdbgHwIme(divHWIme, ".https://cors-anywhere.herokuapp.com/https://www.mdbg.net/chinese/dictionary-ajax?c=hwime", function(selectedChar) {
		var txbInput = $('#' + inputElementId);

		if(txbInput.typeahead !== undefined && inputElementId == 'txt_word')
		{
			txbInput.focus().typeahead('val', txbInput.val() + selectedChar);
		}
		else
		{
			txbInput.val(txbInput.val() + selectedChar);
		}
	}, function() {
		var divHWIme = $('#hwime_' + inputElementId);
		divHWIme.html('');
		divHWIme.hide();

		var divHWImeButton = $('#hwime_on_' + inputElementId);
		divHWImeButton.show();

		var hideOnHwImeOpen = $('.hide-on-hwime-open');
		hideOnHwImeOpen.show();
	});
	
}


function resultOptionSelect(currentResultOption, name, value)
{
	currentResultOption = $(currentResultOption);

	var resultOptions = currentResultOption.parent().find('.resultoption').removeClass('selected');
	currentResultOption.addClass('selected');

	var form = document.forms[0];
	
	var activeForms = $('form.active');
	if(activeForms.length > 0)
	{
		form = activeForms[0];
	}
	
	$(form).append('<input type="hidden" name="' + name + '" value="' + value + '" />');

	form.submit();
}

var worddictCurrentTab = 'word';
var worddictAdvancedDefaultValue = 'Use the form below, your Advanced Search will appear here';
function selectWorddictTab(tab)
{
	if(window['autoComplete_txt_word'] != undefined)
	{
		autoComplete_txt_word.clearSuggestions();
	}
	
	var oldValue = '';
	if(worddictCurrentTab == 'word' && $('#txt_word').val() != '')
	{
		oldValue = $('#txt_word').val();
	}
	else if(worddictCurrentTab == 'wordadvanced' && $('#txt_word_advanced').val() != '' && $('#txt_word_advanced').val() != worddictAdvancedDefaultValue)
	{
		oldValue = $('#txt_word_advanced').val();
	}
	else if(worddictCurrentTab == 'text' && $('#txa_text').val() != '')
	{
		oldValue = $('#txa_text').val();
	}

	if(tab == 'word')
	{
		$('#form_wdqt').removeClass('active');
		$('#form_wdqb').addClass('active');
		$('#form_wdqb_advanced').removeClass('active');
		
		$('#section_text').hide();
		$('#section_word_simple').show();
		$('#section_word_advanced').hide();
		$('#ime_text').hide();
		$('#ime_word').show();
		$('#tab_text').attr('class', '');
		$('#tab_word').attr('class', 'tabset_selected');
	
		if(oldValue != '')
		{
			$('#txt_word').val(oldValue);
		}
	
		$('#txt_word').focus();
	}
	else if(tab == 'wordadvanced')
	{
		$('#form_wdqt').removeClass('active');
		$('#form_wdqb').removeClass('active');
		$('#form_wdqb_advanced').addClass('active');
		
		updateWorddictTextOptionVisibility();
		updateQueryFromAdvancedForm();
	
		$('#section_text').hide();
		$('#section_word_simple').hide();
		$('#section_word_advanced').show();
		$('#ime_text').hide();
		$('#ime_word').hide();
		$('#tab_text').attr('class', '');
		$('#tab_word').attr('class', 'tabset_selected');
	}
	else if(tab == 'text')
	{
		$('#form_wdqt').addClass('active');
		$('#form_wdqb').removeClass('active');
		$('#form_wdqb_advanced').removeClass('active');

		updateWorddictTextOptionVisibility();

		$('#section_text').show();
		$('#section_word_simple').hide();
		$('#section_word_advanced').hide();
		$('#ime_text').show();
		$('#ime_word').hide();
		$('#tab_text').attr('class', 'tabset_selected');
		$('#tab_word').attr('class', '');
	
		if(oldValue != '')
		{
			$('#txa_text').val(oldValue);
		}
	
		$('#txa_text').focus();
	}

	updateWorddictTextOptionVisibility();
	worddictCurrentTab = tab;
}

function updateWorddictTextOptionVisibility()
{
	if($('#select_wdqtm').val() == '2')
	{
		$('#section_wdqcham').show();
		$('#select_wdqcham_tip').hide();
	}
	else
	{
		$('#section_wdqcham').hide();
		$('#select_wdqcham_tip').show();
	}
}

function processQueryFromAdvancedFormType(type, value)
{
	if(type == 1)
	{
		value = value + '*';
	}
	else if(type == 2)
	{
		value = '*'+ value;
	}
	else if(type == 3)
	{
		value = '*' + value + '*';
	}
	
	return value;
}

function updateQueryFromAdvancedForm()
{
	var queryString = '';
	var form = $('#wdqb_advanced');
	
	var chineseCharacters = form.find('input[name="chineseValue"]').val().split(' ');
	for(var idx = 0, len = chineseCharacters.length ; idx < len ; ++idx)
	{
		var chineseCharacter = chineseCharacters[idx];
		if(chineseCharacter != '')
		{
			queryString += ' c:' + processQueryFromAdvancedFormType(form.find('select[name="chineseType"]').val(), chineseCharacter);
		}
	}
	var chineseNotCharacters = form.find('input[name="chineseNotValue"]').val().split(' ');
	for(var idx = 0, len = chineseNotCharacters.length ; idx < len ; ++idx)
	{
		var chineseNotCharacter = chineseNotCharacters[idx];
		if(chineseNotCharacter != '')
		{
			queryString += ' -c:' + processQueryFromAdvancedFormType(form.find('select[name="chineseNotType"]').val(), chineseNotCharacter);
		}
	}

	var pinyinSyllables = form.find('input[name="pinyinValue"]').val().split(' ');
	for(var idx = 0, len = pinyinSyllables.length ; idx < len ; ++idx)
	{
		var pinyinSyllable = pinyinSyllables[idx];
		if(pinyinSyllable != '')
		{
			queryString += ' p:' + processQueryFromAdvancedFormType(form.find('select[name="pinyinType"]').val(), pinyinSyllable);
		}
	}
	var pinyinNotSyllables = form.find('input[name="pinyinNotValue"]').val().split(' ');
	for(var idx = 0, len = pinyinNotSyllables.length ; idx < len ; ++idx)
	{
		var pinyinNotSyllable = pinyinNotSyllables[idx];
		if(pinyinNotSyllable != '')
		{
			queryString += ' -e:' + processQueryFromAdvancedFormType(form.find('select[name="pinyinNotType"]').val(), pinyinNotSyllable);
		}
	}

	if($.trim(form.find('input[name="englishPhrase"]').val()) != '')
	{
		queryString += ' e:"' + processQueryFromAdvancedFormType(0, $.trim(form.find('input[name="englishPhrase"]').val()) + '"');
	}
	if($.trim(form.find('input[name="englishNotPhrase"]').val()) != '')
	{
		queryString += ' -e:"' + processQueryFromAdvancedFormType(0, $.trim(form.find('input[name="englishNotPhrase"]').val()) + '"');
	}

	var englishValues = form.find('input[name="englishValue"]').val().split(' ');
	for(var idx = 0, len = englishValues.length ; idx < len ; ++idx)
	{
		var englishValue = englishValues[idx];
		if(englishValue != '')
		{
			queryString += ' e:' + processQueryFromAdvancedFormType(form.find('select[name="englishType"]').val(), englishValue);
		}
	}
	var englishNotValues = form.find('input[name="englishNotValue"]').val().split(' ');
	for(var idx = 0, len = englishNotValues.length ; idx < len ; ++idx)
	{
		var englishNotValue = englishNotValues[idx];
		if(englishNotValue != '')
		{
			queryString += ' -e:' + processQueryFromAdvancedFormType(form.find('select[name="englishNotType"]').val(), englishNotValue);
		}
	}

	queryString = $.trim(queryString);
	if(queryString == '')
	{
		$('#txt_word_advanced').val(worddictAdvancedDefaultValue);
	}
	else
	{
		$('#txt_word_advanced').val(queryString);
	}
}

function formAutoPostGet(formElement)
{
	formElement = $(formElement);
	if(formElement.serialize().length > 1000)
	{
		formElement.attr('method', 'post');
	}
	else
	{
		formElement.attr('method', 'get');
	}
}




function GoBack()
{
	if(location.hash=="#top")
		history.go(-2);
	else
		history.go(-1);
}

function as(unicode) {
	var popup=window.open('popup_animation_strokes.php?uvd='+unicode, 'radical', 'resizable=yes,scrollbars=yes,width=380,height=420');

	return false;
}

function wordVocabPopup(text, simpTrad)
{
	var popup=window.open('dictionary-ajax?c=wordvocab&i=' + encodeURIComponent(text) + '&st=' + encodeURIComponent(simpTrad), '_blank', 'resizable=yes,scrollbars=yes,width=900,height=700');
	return false;
}

function popup(url) {
	var popup=window.open(url, '_blank', 'resizable=yes,scrollbars=yes');
	return false;
}

function addSearchEngine(name,ext,cat)
{
	if ((typeof window.sidebar == "object") && (typeof window.sidebar.addSearchEngine == "function"))
	{
		//cat="Web";
		//cat=prompt("In what category should this engine be installed?","Web")
		window.sidebar.addSearchEngine(
			"https://www.mdbg.net/chinese/extras/searchplugins/"+name+".src",
			"https://www.mdbg.net/chinese/extras/searchplugins/"+name+"."+ext,
			name,
			cat );
	}
	else
	{
		alert("Mozilla Firefox is needed to install this plugin");
	}
}

function getUrlParameter( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function trackExitLink(target, fromPage)
{
	if(target.href !== undefined)
	{
		target = target.href.match(/\/\/([^\/]+)/)[1];
	}
//	var fromPage = getUrlParameter('page');
	var trackUrl = '/exitlink/' + target;
	if(fromPage)
	{
		trackUrl = trackUrl + '/page=' + fromPage;
	}
//	alert(trackUrl);
	trackPageview(trackUrl);
}


// ---------- mouse tracking ----------
var mdbg_mousetracking_onMouseMove = null;

var mdbg_mousetracking_mouseX = 0;
var mdbg_mousetracking_mouseY = 0;

var mdbg_mousetracking_scrollX = 0;
var mdbg_mousetracking_scrollY = 0;

var mdbg_mousetracking_sizeX = 0;
var mdbg_mousetracking_sizeY = 0;

var mdbg_mousetracking_topEdgeDistance = 0;
var mdbg_mousetracking_bottomEdgeDistance = 0;
var mdbg_mousetracking_rightEdgeDistance = 0;

// detect browsers
var mdbg_mousetracking_isBrowserIE = document.all?true:false;
var mdbg_mousetracking_isBrowserSafari = (document.childNodes)&&(!document.all)&&(!navigator.taintEnabled)&&(!navigator.accentColorName)?true:false;


function mdbg_mousetracking_enable()
{
	// set the on mouse move event handler
	document.onmousemove = mdbg_mousetracking_updateMouseXY;
	if (!mdbg_mousetracking_isBrowserIE)
	{
		document.captureEvents(Event.MOUSEMOVE);
	}
}

// on mouse move event handler 
function mdbg_mousetracking_updateMouseXY(e)
{
	// get the event object
	if (!e) var e = window.event;

	// get the scroll positions
	if( typeof( window.pageYOffset ) == 'number' )
	{
		//Netscape compliant
		mdbg_mousetracking_scrollY = window.pageYOffset;
		mdbg_mousetracking_scrollX = window.pageXOffset;
	}
	else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) )
	{
		//DOM compliant
		mdbg_mousetracking_scrollY = document.body.scrollTop;
		mdbg_mousetracking_scrollX = document.body.scrollLeft;
	}
	else if( document.documentElement && ( !isNaN(document.documentElement.scrollLeft) || !isNaN(document.documentElement.scrollTop) ) )
	{
		//IE6 standards compliant mode
		mdbg_mousetracking_scrollY = document.documentElement.scrollTop;
		mdbg_mousetracking_scrollX = document.documentElement.scrollLeft;
	}

	if(isNaN(mdbg_mousetracking_scrollX))
	{
		mdbg_mousetracking_scrollX = 0;
	}
	if(isNaN(mdbg_mousetracking_scrollY))
	{
		mdbg_mousetracking_scrollY = 0;
	}

	// get window size
	if( typeof( window.innerWidth ) == 'number' )
	{
		//Non-IE
		mdbg_mousetracking_sizeX = window.innerWidth;
		mdbg_mousetracking_sizeY = window.innerHeight;
	}
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
	{
		//IE 6+ in 'standards compliant mode'
		mdbg_mousetracking_sizeX = document.documentElement.clientWidth;
		mdbg_mousetracking_sizeY = document.documentElement.clientHeight;
	}
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
	{
		//IE 4-5 compatible
		mdbg_mousetracking_sizeX = document.body.clientWidth;
		mdbg_mousetracking_sizeY = document.body.clientHeight;
	}

	// get the mouse coordinates
       if (e.pageX || e.pageY)
       {
		// grab the x-y pos.s if browser is NS
           mdbg_mousetracking_mouseX = e.pageX;
           mdbg_mousetracking_mouseY = e.pageY;
       }
       else if (e.clientX || e.clientY)
       {        	
		// grab the x-y pos.s if browser is IE
		mdbg_mousetracking_mouseX = e.clientX + mdbg_mousetracking_scrollX;
		mdbg_mousetracking_mouseY = e.clientY + mdbg_mousetracking_scrollY;
       }
	
	if (mdbg_mousetracking_mouseX < 0)
	{
		mdbg_mousetracking_mouseX = 0;
	}
	if (mdbg_mousetracking_mouseY < 0)
	{
		mdbg_mousetracking_mouseY = 0;
	}

	// get distance to screen edges
	if(mdbg_mousetracking_isBrowserIE && !window.opera)
	{
		mdbg_mousetracking_rightEdgeDistance = mdbg_mousetracking_sizeX - e.clientX;
		mdbg_mousetracking_bottomEdgeDistance = mdbg_mousetracking_sizeY - e.clientY;
		mdbg_mousetracking_topEdgeDistance = e.clientY;
	}
	else
	{
		if(mdbg_mousetracking_isBrowserSafari)
		{
			// Safari
			mdbg_mousetracking_rightEdgeDistance = mdbg_mousetracking_sizeX - e.clientX + document.body.scrollLeft;
			mdbg_mousetracking_bottomEdgeDistance = mdbg_mousetracking_sizeY - e.clientY + document.body.scrollTop;
			mdbg_mousetracking_topEdgeDistance = e.clientY - document.body.scrollTop;
		}
		else
		{
			// Other browsers such as Mozilla, doesn't count scroll bar, so leave some space for it
			mdbg_mousetracking_rightEdgeDistance = mdbg_mousetracking_sizeX - e.clientX - 20;
			mdbg_mousetracking_bottomEdgeDistance = mdbg_mousetracking_sizeY - e.clientY - 20;
			mdbg_mousetracking_topEdgeDistance = e.clientY;
		}
	}
	
	// update a few times, since it may be resized by the browser after being moved
	mdbg_mousetracking_onMouseMove();
	mdbg_mousetracking_onMouseMove();
//	alert(mdbg_mousetracking_rightEdgeDistance+" "+mdbg_mousetracking_bottomEdgeDistance);

	var debugElement = document.getElementById("debugLabel");
//	debugElement.innerHTML = ''+mdbg_mousetracking_bottomEdgeDistance+' '+mdbg_mousetracking_rightEdgeDistance+' '+mdbg_mousetracking_topEdgeDistance;
//	debugElement.innerHTML = ''+mdbg_mousetracking_mouseX+' '+mdbg_mousetracking_mouseY+' '+mdbg_mousetracking_scrollX+' '+mdbg_mousetracking_scrollY;
	
	return true;
}

// ---------- tooltip ----------

var mdbg_tooltip_tooltipOffsetX = 20;
var mdbg_tooltip_tooltipOffsetY = 20;
var mdbg_tooltip_minTooltipWidth = 150;
var mdbg_tooltip_maxTooltipWidth = 250;

var mdbg_tooltip_tooltipEnabled = false;

function mdbg_tooltip_enable()
{
	mdbg_mousetracking_onMouseMove = mdbg_tooltip_onMouseMove;
	mdbg_mousetracking_enable();
}

function mdbg_tooltip_onMouseMove()
{
	mdbg_tooltip_updateTooltipPosition();
	mdbg_tooltip_updateTooltipPosition();
}

function mdbg_tooltip_updateTooltipPosition()
{
	// update tooltip postition if it's enabled
	if(mdbg_tooltip_tooltipEnabled)
	{
		// get tooltip
		var tooltipElement = document.getElementById("mdbg_tooltip");

		if(tooltipElement.offsetWidth < mdbg_tooltip_minTooltipWidth)
		{
			tooltipElement.style.width = mdbg_tooltip_minTooltipWidth + 'px';
		}
		if(tooltipElement.offsetWidth > mdbg_tooltip_maxTooltipWidth)
		{
			tooltipElement.style.width = mdbg_tooltip_maxTooltipWidth + 'px';
		}

		// set tooltip x location
		if((mdbg_mousetracking_rightEdgeDistance - mdbg_tooltip_tooltipOffsetX - tooltipElement.offsetWidth) < 0)
		{
			tooltipElement.style.left = (mdbg_mousetracking_mouseX - mdbg_tooltip_tooltipOffsetX - tooltipElement.offsetWidth) + "px";
		}
		else
		{
			tooltipElement.style.left = (mdbg_mousetracking_mouseX + mdbg_tooltip_tooltipOffsetX) + "px";
		}

//		var debugElement = document.getElementById("debugLabel");
//		debugElement.innerHTML = '' + tooltipElement.offsetWidth + ' ' + tooltipElement.offsetHeight;

		// set tooltip y location
		if((mdbg_mousetracking_bottomEdgeDistance - mdbg_tooltip_tooltipOffsetY - tooltipElement.offsetHeight) < 0)
		{
			// if the tooltip crosses the bottom screen edge, flip it to the top
			
			// calculate the distance between the top of the tooltip and the top screen edge
			var tooltipTopEdgeDistance = mdbg_mousetracking_topEdgeDistance - (mdbg_tooltip_tooltipOffsetY + tooltipElement.offsetHeight);
			
			if(tooltipTopEdgeDistance < 0)
			{
				// the tooltip crosses the top border after flipping it, lock it to the top edge
				tooltipElement.style.top = (mdbg_mousetracking_mouseY - mdbg_tooltip_tooltipOffsetY - tooltipElement.offsetHeight - tooltipTopEdgeDistance) + "px";
			}
			else
			{
				// place the tooltip on the top
				tooltipElement.style.top = (mdbg_mousetracking_mouseY - mdbg_tooltip_tooltipOffsetY - tooltipElement.offsetHeight) + "px";
			}
		}
		else
		{
			// place the tooltip on the bottom
			tooltipElement.style.top = (mdbg_mousetracking_mouseY + mdbg_tooltip_tooltipOffsetY) + "px";
		}
	}
}

// show tooltip
function mdbg_tooltip_show(content)
{
	var tooltipElement = document.getElementById("mdbg_tooltip");
	tooltipElement.innerHTML = content;
	mdbg_tooltip_updateTooltipPosition();
	tooltipElement.style.visibility = "visible";
	mdbg_tooltip_tooltipEnabled = true;
}

// hide tooltip
function mdbg_tooltip_hide()
{
	var tooltipElement = document.getElementById("mdbg_tooltip");
	mdbg_tooltip_tooltipEnabled = false;
	tooltipElement.style.visibility = "hidden";
	tooltipElement.innerHTML = "";
	tooltipElement.style.width = '';
}

function aj(resultId, button, command, row, input)
{
	button = $(button);
	
	if(typeof mdbgAjState === 'undefined')
	{
		mdbgAjState = {};
	}
	if(mdbgAjState[resultId] === undefined)
	{
		mdbgAjState[resultId] = {};
		mdbgAjState[resultId].state = new Array();
		mdbgAjState[resultId].buttons = new Array();
	}
	
	if(navigator.userAgent.match(/ipad|ipod|iphone/i))
	{
		if(command == 'baike')
		{
			window.open('http://baike.baidu.com/searchword/?word=' + input + '&amp;pic=1&amp;sug=1');
			
			return false;
		}
	}

	var elementId = 'aj' + resultId + '_' + row;
	var element = $("#" + elementId);

	if(mdbgAjState[resultId].buttons[row])
	{
		mdbgAjState[resultId].buttons[row].css('border', '');
		mdbgAjState[resultId].buttons[row].css('background', '');
	}
	
	if(mdbgAjState[resultId].state[row] == command)
	{
		button.css('border', '');
		button.css('background', '');
		mdbgAjState[resultId].state[row] = '';
		element.html('');
		var parent = element.parent();
		parent.hide();
	}
	else
	{
		button.css('border', '#8080ff 2px solid');
		button.css('background', '#e0e0ff');
		mdbgAjState[resultId].state[row] = command;

		var layoutTable = $('<table cellpadding="0" cellspacing="0" width="100%"></table>');
		element.html(layoutTable);
		var layoutTbody = $('<tbody></tbody>');
		layoutTable.append(layoutTbody);
		var layoutTr = $('<tr></tr>');
		layoutTbody.append(layoutTr);
		var layoutTdLeft = $('<td style="vertical-align: top"></td>');
		layoutTr.append(layoutTdLeft);
		var layoutTdRight = $('<td style="vertical-align: top; padding-left: 4px" width="1"></td>');
		layoutTr.append(layoutTdRight);
		
		var closeLink = $('<a href="#"></a>');
		closeLink.append($('<img src="rsc/img/close2.gif" alt="Close" />'));
		closeLink.click(function(event) { aj(resultId, button, command, row, input); event.stop(); });
		
		layoutTdRight.append(closeLink);
		
		var content = $('<div></div>');
		layoutTdLeft.append(content);
		
		content.html('<p>Loading data... please wait...</p>');
		
		var parent = element.parent();
		parent.show();
		
		if(command == 'google')
		{
			content.html('<iframe src="//www.google.com/search?pws=0&amp;newwindow=1&amp;ie=UTF-8&amp;oe=UTF-8&amp;q=' + encodeURIComponent(input) + '" width="730" height="400"></iframe>');
		}
		else if(command == 'baike')
		{
			content.html('<div style="width: 745px"></div><iframe src="http://baike.baidu.com/searchword/?word=' + input.replace(/[<>&]/g, ' ') + '&amp;pic=1&amp;sug=1" width="99%" height="400" scrolling="yes" style="background-color: #ffffff"></iframe>');
		}
		else
		{
			$.ajax({
				url: 'dictionary-ajax',
				type: "get",
				dataType: "html",
				data: {
					"c": command,
					"i": input
				},
				success: function(returnData) {
					content.html(returnData); 
				},
				error: function(e) {
					alert(e);
				}
			});
		}
	}
	
	mdbgAjState[resultId].buttons[row] = button;
	
	return false;
}

mdbg.PlaylistSoundPlayer = function(element) {
	this.element = $(element);
	this.buttonElement = null;
	this.playlist = null;
	this.trackIdx = 0;
	this.isPlaying = false;
	this.isInitialized = false;
	this.onInitHandler = null;
	this.hadTimeout = false;
	
	this.initPlaylist = function(playlist) {
		var that = this;
		this.playlist = playlist;

		this.element.html('');
		this.element.attr('class', 'mdbg_playlistsoundplayer'); 
		
		if(window.soundManager) {
			this.onInit();
		}
		else {
			var sm2Element = $('<div id="sm2-container"></div>');
			$(document.body).prepend(sm2Element);
			sm2Element.html('<span class="wmesg"><strong>Warning: flash failed to load!</strong><br />Please click the button below if you are using a flash blocker.<br /></span>');

//			var sm2DebugElement = new Element('div', { 'id': 'soundmanager-debug' });
//			$(document.body).insert({top: sm2DebugElement});

			window.soundManager = new SoundManager();
			soundManager.useFlashBlock = true;
			soundManager.useHTML5Audio = true;
			soundManager.preferFlash = false;
			soundManager.debugMode = false;
			soundManager.debugFlash = false;
			soundManager.consoleOnly = false;
			soundManager.url = 'rsc/swf/sm2.v297a-20150601/swf/';
			soundManager.onready(function() {
				that.onInitDelayed();
			});
			soundManager.ontimeout(function() {
				that.onTimeout();
			});
			soundManager.beginDelayedInit();
		}
	};

	this.onTimeout = function() {
		this.hadTimeout = true;
	};

	this.onInitDelayed = function() {
		var that = this;
		if(this.hadTimeout) {
			this.hadTimeout = false;
			setTimeout(function() {
				that.onInit();
			}, 1000);
		}
		else {
			this.onInit();
		}
	};
	
	this.onInit = function() {
		var that = this;

		var buttonElement = $('<div class="playButton"></div>');
		this.element.prepend(buttonElement);
		buttonElement.click(function() {
			that.onButtonClick();
		});
		this.buttonElement = buttonElement;

		var trackListElement = $('<ol></ol>');
		this.element.append(trackListElement);
		for(var trackIdx = 0 ; trackIdx < this.playlist.length ; trackIdx++) {
			var trackElement = $('<li></li>');
			trackListElement.append(trackElement);
			
			var trackLink = $('<a href="#"></a>');
			trackLink.html(this.playlist[trackIdx].name);
			trackLink.click(
				(function(thatTrackIdx){
					return function() {
						that.stop();
						that.play(thatTrackIdx, true);
						return false;
					}
				})(trackIdx));
			trackElement.append(trackLink);

			this.playlist[trackIdx].element = trackElement;
		}

		this.isInitialized = true;
		if(this.onInitHandler) {
			this.onInitHandler(this);
		}
	};
	
	this.setOnInitHandler = function(handler) {
		this.onInitHandler = handler;
	};
	
	this.stop = function() {
		if(this.isInitialized && this.isPlaying) {
			soundManager.stopAll();
			this.onFinish(this.trackIdx);
		}
	};

	this.onButtonClick = function() {
		if(this.isPlaying) {
			this.stop();
		}
		else {
			this.play(0);
		}
	};

	this.onPlay = function(trackIdx) {
		this.isPlaying = true;
		this.buttonElement.attr('class', 'stopButton');
		this.playlist[trackIdx].element.addClass("playing");
	};
	
	this.onFinish = function(trackIdx) {
		this.isPlaying = false;
		this.buttonElement.attr('class', 'playButton');
		this.playlist[trackIdx].element.removeClass("playing");
	};
	
	this.play = function(trackIdx, single) {
		var that = this;
		if(trackIdx !== undefined) {
			this.trackIdx = trackIdx;
		}
		else {
			trackIdx = this.trackIdx;
		}

		if(this.isInitialized) {
			var soundId = this.element.attr('id') + '_' + trackIdx;
			
			var sound = soundManager.createSound({ id: soundId, url: this.playlist[trackIdx].url });

			this.onPlay(trackIdx);

			if(single || (trackIdx+1) >= this.playlist.length) {
				sound.play({ onfinish: function() {
					that.onFinish(trackIdx);
				} });
			}
			else {
				sound.play({ onfinish: function() {
					that.onFinish(trackIdx);
					that.play(trackIdx + 1, false);
				} });
//				sound.play({ onjustbeforefinish: function() { that.onFinish(trackIdx); that.play(trackIdx + 1, false); } });
//				sound.play({ onjustbeforefinish: this.play.bind(this, trackIdx + 1), onfinish: this.onFinish.bind(this, trackIdx) });
			}
		}
	};
};

// /* ---------- Start Lightbox ---------- */

// /*
// Created By: Chris Campbell
// Website: http://particletree.com
// Date: 2/1/2006

// Adapted By: Simon de Haan
// Website: http://blog.eight.nl
// Date: 21/2/2006

// Adapted By: MDBG
// Website: https://www.mdbg.net
// Date: 2011-12-09

// Inspired by the lightbox implementation found at http://www.huddletogether.com/projects/lightbox/
// And the lightbox gone wild by ParticleTree at http://particletree.com/features/lightbox-gone-wild/

// */

// mdbg.lightbox = function(ctrl, content, onActivate, onDeactivate) {

// 	this.contentElement = null;
// 	this.content = null;
// 	this.onActivate = null;
// 	this.onDeactivate = null;
// 	this.yPos = 0;
// 	this.xPos = 0;

// 	// Test if the browser is Internet Explorer
// 	this.isIE = function() {
// 		if(navigator.userAgent.toLocaleLowerCase().match(/msie/) == 'msie')
// 			return true;
// 		else
// 			return false;
// 	};
	
// 	// Turn everything on - mainly the IE fixes
// 	this.activate = function() {
// 		if (this.isIE()) {
// 			this.getScroll();
// 			this.prepareIE('100%', 'hidden');
// 			this.setScroll(0,0);
// 			this.hideSelects('hidden');
// 		}
		
// 		if(this.content)
// 		{
// 			this.contentElement.html(this.content);
// 		}
		
// 		this.displayLightbox("block");

// 		if(this.onActivate)
// 		{
// 			this.onActivate();
// 		}
// 	};
	
// 	// Ie requires height to 100% and overflow hidden or else you can scroll down past the lightbox
// 	this.prepareIE = function(height, overflow) {
// 		var body = $('body');
// 		body.css('height', height);
// 		body.css('overflow', overflow);
  
// 		var html = $('html');
// 		html.css('height', height);
// 		html.css('overflow', overflow);
// 	};
	
// 	// In IE, select elements hover on top of the lightbox
// 	this.hideSelects = function(visibility) {
// 		$('select').css('visibility', visibility);
// 	};
	
// 	// Taken from lightbox implementation found at http://www.huddletogether.com/projects/lightbox/
// 	this.getScroll = function() {
// 		if (self.pageYOffset) {
// 			this.yPos = self.pageYOffset;
// 		} else if (document.documentElement && document.documentElement.scrollTop) {
// 			this.yPos = document.documentElement.scrollTop; 
// 		} else if (document.body) {
// 			this.yPos = document.body.scrollTop;
// 		}
// 	};
	
// 	this.setScroll = function(x, y) {
// 		window.scrollTo(x, y); 
// 	};
	
// 	this.displayLightbox = function(display) {
// 		var that = this;
		
// 		// get the inner div
// 		var lightbox = this.contentElement.children(":first");
		
// 		// set the overlay display mode
// 		$('#overlay').css('display', display);
		
// 		// click on the overlay should close the lightbox
// 		if(display != 'none') {
// 			$('#overlay').click(function() {
// 				that.deactivate();
// 			});
// 		}
// 		else {
// 			$('#overlay').off('click');
// 		}

// 		// center the lightbox based on it's size
// 		var width = lightbox.width();
// 		var height = lightbox.height();
// 		if(width == 0)
// 		{
// 			width = parseInt(lightbox.css('width'));
// 			height = parseInt(lightbox.css('height'));
// 		}
// 		lightbox.css('left', (-width / 2) + "px");
// 		lightbox.css('top', (-height / 2) + "px");

// 		// set the lightbox display mode
// 		this.contentElement.css('display', display);

// 		// bind actions
// 		if(display != 'none') {
// 			this.actions();
// 		}
// 	};
	
// 	// Search through new links within the lightbox, and attach click event
// 	this.actions = function() {
// 		var lbActions = $('.lbAction');

// 		var that = this;
// 		lbActions.each( function(index) {
// 			var lbAction = $(this);
// 			lbAction.off('click');
// 			lbAction.click(function() {
// 				that[lbAction.attr('rel')]();
// 				return false;
// 			});
// 		});

// 	};
	
// 	// Deactivate the lightbox
// 	this.deactivate = function() {
// 		if (this.isIE()) {
// 			this.setScroll(0,this.yPos);
// 			this.prepareIE("auto", "auto");
// 			this.hideSelects("visible");
// 		}
		
// 		this.displayLightbox("none");

// 		if(this.content)
// 		{
// 			this.contentElement.html('');
// 		}
		
// 		if(this.onDeactivate)
// 		{
// 			this.onDeactivate();
// 		}
// 	};

	
	
// 	// add the overlay div if missing
// 	if($('#overlay').length == 0)
// 	{
// 		var overlay = $('<div id="overlay"></div>');
// 		var body = $('body');
// 		body.append(overlay);
// 	}
	
// 	this.contentElement = $('<div></div>');
// 	this.contentElement.addClass('lightbox');
// 	var body = $('body');
// 	body.append(this.contentElement);
	
// 	if(onActivate)
// 	{
// 		this.onActivate = onActivate;
// 	}
// 	if(onDeactivate)
// 	{
// 		this.onActivate = onDeactivate;
// 	}
	
// 	this.content = content;

// 	var that = this;
// 	ctrl.off('click');
// 	ctrl.click(function (){ 
// 		that.activate();
// 		return false;
// 	});
// };

// /* ---------- End Lightbox ---------- */

// mdbg.createCrAdLightbox = function(ctrl, sourceId)
// {
// 	var content = '<div style="width: 640px; height: 400px">';
// 	content += '	<iframe style="background-color: #bbb" width="640" height="360" src="//www.youtube.com/embed/6RtMX1Hf-KI?autohide=1&amp;autoplay=1&amp;controls=0&amp;hd=1&amp;iv_load_policy=3&amp;rel=0&amp;showsearch=0" frameborder="0" allowfullscreen></iframe>';
// 	content += '	<div style="padding-top: 5px">';
// 	content += '		<button onclick="trackExitLink(\'mdbg.loqu8.com\', \'' + sourceId + '-lb_download\'); window.location = \'https://mdbg.loqu8.com/installing.htm\'">Download</button>';	
// 	content += '		<button onclick="trackExitLink(\'mdbg.loqu8.com\', \'' + sourceId + '-lb_moreinfo\'); window.location = \'https://mdbg.loqu8.com/\'">Learn more</button>';
// 	content += '	</div>';
// 	content += '	<div style="position: absolute; bottom: 30px; right: 10px">';
// 	content += '		<a href="#" class="lbAction" rel="deactivate">Close</a>';
// 	content += '	</div>';
// 	content += '	<div style="position: absolute; bottom: 10px; right: 10px">';
// 	content += '		<a href="dictionary?page=contact&amp;meelcommentabout=chinesereader&amp;meelcommentaboutversion=trial">Unable to install? Please contact us.</a>';
// 	content += '	</div>';
// 	content += '	<div style="position: absolute; bottom: -1px; left: 10px">';
// 	content += '		<iframe width="1" height="1" frameborder="0" style="background-color: #b8b8b8" src="https://mdbg.loqu8.com/installing.htm"></iframe>';
// 	content += '	</div>';
// 	content += '</div>';

// 	new mdbg.lightbox(ctrl, content, function() { trackExitLink('mdbg.loqu8.com', sourceId + '-lb_open'); } );
// }


// mdbg.createCrAdLightboxCn = function(ctrl, sourceId)
// {
// 	var content = '<div style="width: 640px; height: 440px">';
// 	content += '	<embed src="//static.youku.com/v/swf/qplayer.swf?VideoIDS=	zM0NTEyNzE2=&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0" quality="high" width="640" height="400" allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed>';
// 	content += '	<div style="padding-top: 5px">';
// 	content += '		<button onclick="trackExitLink(\'mdbg.loqu8.com\', \'' + sourceId + '-lb_download-cn\'); window.location = \'https://mdbg.loqu8.com/installing.htm\'">Download</button>';	
// 	content += '		<button onclick="trackExitLink(\'mdbg.loqu8.com\', \'' + sourceId + '-lb_moreinfo-cn\'); window.location = \'https://mdbg.loqu8.com/\'">Learn more</button>';
// 	content += '	</div>';
// 	content += '	<div style="position: absolute; bottom: 30px; right: 10px">';
// 	content += '		<a href="#" class="lbAction" rel="deactivate">Close</a>';
// 	content += '	</div>';
// 	content += '	<div style="position: absolute; bottom: 10px; right: 10px">';
// 	content += '		<a href="dictionary?page=contact&amp;meelcommentabout=chinesereader&amp;meelcommentaboutversion=trial">Unable to install? Please contact us.</a>';
// 	content += '	</div>';
// 	content += '	<div style="position: absolute; bottom: -1px; left: 10px">';
// 	content += '		<iframe width="1" height="1" frameborder="0" style="background-color: #b8b8b8" src="https://mdbg.loqu8.com/installing.htm"></iframe>';
// 	content += '	</div>';
// 	content += '</div>';
	
// 	new mdbg.lightbox(ctrl, content, function() { trackExitLink('mdbg.loqu8.com', sourceId + '-lb_open-cn'); } );
// }


// // source: http://lions-mark.com/jquery/scrollTo/
// $.fn.scrollTo = function( target, options, callback ){
// 	  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
// 	  var settings = $.extend({
// 	    scrollTarget  : target,
// 	    offsetTop     : 50,
// 	    duration      : 500,
// 	    easing        : 'swing'
// 	  }, options);
// 	  return this.each(function(){
// 	    var scrollPane = $(this);
// 	    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
// 	    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
// 	    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
// 	      if (typeof callback == 'function') { callback.call(this); }
// 	    });
// 	  });
// 	}