/* 
 * Copyright (C) 2015 MDBG.NET
 *
 * Based on:
 * 
 * Ajax-based hand written recognition
 *
 * Copyright (C) 2005-2007 Taku Kudo <taku@chasen.org>
 * This is free software with ABSOLUTELY NO WARRANTY.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA
 * 02111-1307, USA
 *
 */

function MdbgHwIme(element, serverUrl, onCharSelected, onClose) {
	this.element = $(element);
	
	var html = 
	'<button class="btn btn-outline-dark" id="btnBack">Back <span id="ionDrawBack" class="ion ion-back"></span> </button>'+
	'<button class="btn btn-outline-dark" id="btnClear"> Clear <span id="ionDrawClear" class="ion ion-clear"></span> </button>'+
	'<button class="btn btn-outline-dark" id="btnHintDraw">Hint <span id="ionDrawHint" class="ion ion-hint"></span> </button>'+
		'<div style="clear: both"></div>' +
		'<div class="mdbghwime">' +
		'	<div class="mdbghwime-canvas-bar">' +
		'		<canvas class="mdbghwime-canvas" width="256" height="256"></canvas>' +
		'	</div>' +
// 		'	<div class="mdbghwime-button-bar">' +
// //		'		<div class="mdbghwime-simptrad-button mdbghwime-button" title="Simplified / Traditional Chinese"><div class="simp">simp</div><div class="trad">trad</div></div>' +
// 		'		<div class="mdbghwime-back-line-button mdbghwime-button ion-ios-undo" title="Undo last stroke"></div>' +
// 		'		<div class="mdbghwime-clear-button mdbghwime-button ion-backspace" title="Clear all"></div>'  +
// 		'		<br />' +
// 		'		<br />' +
// 		'		<br />' +
// 		'		<div class="mdbghwime-previous-page-button mdbghwime-button ion-arrow-up-b" title="Previous page"></div>' +
// 		'		<div class="mdbghwime-page-label"></div>' +
// 		'		<div class="mdbghwime-next-page-button mdbghwime-button ion-arrow-down-b" title="Next page"></div>' +
// 		'	</div>' +
		'	<div class="mdbghwime-result">' +
		'		<span class="mdbghwime-loading-indicator"><span class="ion ion-loop"></span></span>' +
		'		<span class="mdbghwime-error-indicator"><span class="ion ion-alert"></span></span>' +
		
		'		<div></div>' +
		'	</div>' +
		'</div>' +
		'<div style="clear: both"></div><br>';
	//TODO: Ifresult if within first 10 options, copy to 
	element.html(html);
	
	var canvasElement = element.find(".mdbghwime-canvas")[0];

	this.loadingIndicator = element.find(".mdbghwime-loading-indicator");
	this.loadingIndicator.fadeOut(0);
	
	this.errorIndicator = element.find(".mdbghwime-error-indicator");
	this.errorIndicator.fadeOut(0);
	
	this.serverUrl = serverUrl;
	this.onCharSelected = onCharSelected;
	this.onClose = onClose;

	this.mdbgHwImeGrid = new MdbgHwImeGrid(canvasElement);
	this.adjustMdbgHwImeGridOffsets();
	this.postSeq = 0;
	this.lastXhr = null;
	
	this.start = 0;
	this.limit = 8;
	this.total = 0;
	
	this.sequence = [];
	this.strokeNum = 0;
	
	this.colorHue = 0;
	this.colorHueIncrement = 30;
	this.colorSaturation = '100%';
	this.colorLightness = '40%';
	
	this.prevLineX = 0;
	this.prevLineY = 0;
	
	this.minDrawDistance = 5;
	
	this.smoothStrokes = true;
	
	var self = this;
	
	this.mdbgHwImeGrid.element.onmousedown = function(event) {
		self.mouseDown(event);
	}
	this.mdbgHwImeGrid.element.onmousemove = function(event) {
		self.mouseMove(event);
	}
	this.mdbgHwImeGrid.element.onmouseup = function(event) {
		self.mouseUp(event);
	}
	this.mdbgHwImeGrid.element.ontouchstart = function(event) {
		self.touchStart(event);
	}
	this.mdbgHwImeGrid.element.ontouchmove = function(event) {
		self.touchMove(event);
	}
	this.mdbgHwImeGrid.element.ontouchend = function(event) {
		self.touchEnd(event);
	}

	//var clearButton = element.find(".mdbghwime-clear-button");
	var clearButton = $("#btnClear");
	clearButton.click(function(event) {
		self.clearAll();
	});
	ionDrawClear.click(()=>self.clearAll());
	
	//var backButton = element.find(".mdbghwime-back-line-button");
	var backButton = $("#btnBack");
	backButton.click(function(event) {
		self.undoStroke();
	});
	ionDrawBack.click(()=>self.undoStroke());

	this.previousPageButton = element.find(".mdbghwime-previous-page-button");
	this.previousPageButton.click(function(event) {
		self.previousPage();
	});

	this.pageLabel = element.find(".mdbghwime-page-label");
	
	this.nextPageButton = element.find(".mdbghwime-next-page-button");
	this.nextPageButton.click(function(event) {
		self.nextPage();
	});

	//this.simpTrad = getCookie('mdbghwime-simptrad', 0) == '1';
	this.simpTradButton = element.find(".mdbghwime-simptrad-button");
	if (this.simpTrad) {
		this.simpTradButton.addClass('selected');
	}
	this.simpTradButton.click(function(event) {
		self.toggleSimpTrad();
	});

	//this.showNumbers = getCookie('mdbghwime-show-numbers', 1) == '1';
	this.showNumbersButton = element.find(".mdbghwime-show-numbers-button");
	if (this.showNumbers) {
		this.showNumbersButton.addClass('selected');
	}
	this.showNumbersButton.click(function(event) {
		self.toggleShowNumbers();
	});
	
	var closeButton = element.find(".mdbghwime-close-button");
	closeButton.click(function(event) {
		self.onClose();
	});
	
	// window.onresize = function() {
	// 	//self.adjustMdbgHwImeGridOffsets();
	// 	//this.mdbgHwImeGrid.clear();
	// //	this.drawAll();
	// }

	this.colors = new Array();
	this.clearAll();
}
MdbgHwIme.prototype.previousPage = function() {
	this.start -= this.limit;
	if (this.start < 0) {
		this.start = 0;
	}
	this.updatePagers();
	this.sendStrokesToServer();
}
MdbgHwIme.prototype.nextPage = function() {
	this.start += this.limit;
	this.updatePagers();
	this.sendStrokesToServer();
}
MdbgHwIme.prototype.resetPaging = function() {
	this.start = 0;
	this.total = 0;
	this.updatePagers();
}
MdbgHwIme.prototype.updatePagers = function() {
	// var hasPrevious = this.start > 0;
	// var hasNext = this.start + this.limit < this.total;
	// if (hasPrevious) {
	// 	this.previousPageButton.css('visibility', 'visible');
	// }
	// else {
	// 	this.previousPageButton.css('visibility', 'hidden');
	// }

	// this.pageLabel.text('' + (Math.round(this.start / this.limit) + 1) + '/' + (Math.round(this.total / this.limit)));
	// if (hasPrevious || hasNext) {
	// 	this.pageLabel.css('visibility', 'visible');
	// }
	// else {
	// 	this.pageLabel.css('visibility', 'hidden');
	// }
	
	// if (hasNext) {
	// 	this.nextPageButton.css('visibility', 'visible');
	// }
	// else {
	// 	this.nextPageButton.css('visibility', 'hidden');
	// }
}
MdbgHwIme.prototype.getStrokeColor = function() {
	var hue = (this.colorHue + this.strokeNum * this.colorHueIncrement) % 360;
	return 'hsl(' + hue + ', ' + this.colorSaturation + ', ' + this.colorLightness + ')';
}
MdbgHwIme.prototype.undoStroke = function() {
	if (this.strokeNum > 0) {
		this.sequence.pop();
		this.strokeNum--;
	}
	if (this.strokeNum > 0) {
		this.mdbgHwImeGrid.clear();
		this.drawAll();
		this.sendStrokesToServer();
	}
	else {
		this.clearAll();
	}
}
MdbgHwIme.prototype.clearAll = function() {
	this.resetBrush();
	this.sequence = [];
	this.strokeNum = 0;
	this.mdbgHwImeGrid.clear();
	this.resetPaging();
	this.resultCallback();
	//TODO: send event to clear candidates list
}
MdbgHwIme.prototype.sendStrokesToServer = function() {
	if (this.strokeNum == 0) {
		return;
	}
	if (this.strokeNum == 1) {
		if (this.sequence[0].length == 1) {
			return;
		}
		var points_all_same = true;
		var seq0 = this.sequence[0];
		var x0 = seq0[0].x;
		var y0 = seq0[0].y;
		for (var i = 1; i < seq0.length; i++) {
			if (seq0[i].x != x0 || seq0[i].y != y0) {
				points_all_same = false;
				break;
			}
		}
		if (points_all_same) {
			return;
		}
	}
	if (this.strokeNum > 50) {
		return;
	}
	
	this.loadingIndicator.fadeIn(100);

	clearTimeout(timeout)	
	timeout = setTimeout(()=>{
		
		var strokeData = this.getStrokeData();
		var self = this;
		this.postStrokeDataToServer(strokeData, function(result) {
			self.resultCallback(result);
		});
	}, 3000);
}
//for use above
//TODO: clear this delay once character discovery is done on own server
var timeout;

MdbgHwIme.prototype.finishStroke = function() {
	this.resetPaging();
	if (this.point_num > 1) {
		if (this.smoothStrokes) {
			this.smooth();
		}
		else {
			this.annotate(this.strokeNum);
		}

		this.strokeNum++;
		this.resetBrush();

		if (this.smoothStrokes) {
			this.mdbgHwImeGrid.clear();
			this.drawAll();
		}
		
		this.sendStrokesToServer();
	}
	else {
		this.sequence[this.strokeNum].length = 0;
		this.resetBrush();
	}
}
MdbgHwIme.prototype.mouseDown = function(event) {
	this.startStroke();
	this.mouseTrace(event);
	if (event.preventDefault) {
		event.preventDefault();
	}
	else {
		event.returnValue = false;
	}
	return false;
}
MdbgHwIme.prototype.mouseMove = function(event) {
	this.mouseTrace(event);
}
MdbgHwIme.prototype.mouseUp = function(event) {
	if (this.active) {
		this.mouseTrace(event);
		this.finishStroke();
	}
}
MdbgHwIme.prototype.touchStart = function(event) {
	this.startStroke();
	this.touching = true;
	this.touchTrace(event);
}
MdbgHwIme.prototype.touchMove = function(event) {
	this.touchTrace(event);
}
MdbgHwIme.prototype.touchEnd = function(event) {
	if (this.active) {
		this.touchTrace(event);
		this.finishStroke();
	}
	this.touching = false;
}
MdbgHwIme.prototype.resetBrush = function() {
	this.active = false;
	this.point_num = 0;
}
MdbgHwIme.prototype.startStroke = function() {
	this.active = true;
}
MdbgHwIme.prototype.startLine = function(x, y) {
	this.strokeLength = 0.0;
	this.prevLineX = x;
	this.prevLineY = y;
}
MdbgHwIme.prototype.drawLine = function(x, y) {
	var dX = Math.abs(x - this.prevLineX);
	var dY = Math.abs(y - this.prevLineY);
	var d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));

	this.strokeLength += d;
	
	if (this.strokeLength < 8) {
		this.mdbgHwImeGrid.lineWidth = 3.5 / (Math.abs(this.strokeLength-8.0) / 10.0 + 1) + 3.0;
	}
	else {
		this.mdbgHwImeGrid.lineWidth = 3.5 / (Math.abs(this.strokeLength-8.0) / 10.0 + 1) + 3.0;
	}
	this.mdbgHwImeGrid.startLine(x, y);
	this.mdbgHwImeGrid.drawLine(this.prevLineX, this.prevLineY, x, y);

	this.prevLineX = x;
	this.prevLineY = y;
}
MdbgHwIme.prototype.addPoint = function(x, y) {
	if (this.point_num == 0) {
		this.sequence[this.strokeNum] = new Array;
		var sq = this.sequence[this.strokeNum];
		sq[0] = {
			x: x,
			y: y
		};
		this.point_num++;
		var color = this.getStrokeColor();
		this.colors[this.strokeNum] = color;
		this.mdbgHwImeGrid.color = color;
		
		this.startLine(x, y);
	}
	else {
		var sq = this.sequence[this.strokeNum];
		var n = this.point_num;
		var prev = this.point_num - 1;
		
		var dX = Math.abs(x - sq[prev].x);
		var dY = Math.abs(y - sq[prev].y);
		var d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
		if (d > this.minDrawDistance) {
			sq[n] = {
				x: x,
				y: y
			};
			this.point_num++;

			this.drawLine(x, y);
		}
	}
}
MdbgHwIme.prototype.trace = function(pos) {
	if (pos.x < 3 || pos.y < 3 || pos.x >= (this.mdbgHwImeGrid.size - 3) || pos.y >= (this.mdbgHwImeGrid.size - 3)) {
		this.finishStroke();
	}
	else {
		this.addPoint(Math.round(pos.x), Math.round(pos.y));
	}
}
MdbgHwIme.prototype.mouseTrace = function(event) {
	if (!this.active) {
		return;
	}
	if (this.touching) {
		return;
	}
	var pos = this.getMdbgHwImeGridRelativeCoordinates(getPosition(event));
	this.trace(pos);
}
MdbgHwIme.prototype.touchTrace = function(event) {
	if (!this.active) {
		return;
	}
	var orig = getTouchPosition(event);
	var pos = this.getMdbgHwImeGridRelativeCoordinates(orig);
	this.trace(pos);
	event.preventDefault();
}
MdbgHwIme.prototype.drawAll = function() {
	var sq = this.sequence;
	for (var s = 0; s < this.strokeNum; s++) {
		var st = sq[s];
		this.mdbgHwImeGrid.color = this.colors[s];
		this.startLine(st[0].x, st[0].y);
		this.annotate(s);
		for (var p = 1; p < st.length; p++) {
			this.drawLine(st[p].x, st[p].y);
		}
	}
}
MdbgHwIme.prototype.annotate = function(stroke) {
	if (!this.showNumbers) {
		return;
	}
	var offsetlength = 15;
	var x;
	var y;
	var xoffset = offsetlength;
	var yoffset = offsetlength;
	var str = this.sequence[stroke];
	var gap = 1;
	x = str[0].x;
	y = str[0].y;
	if (str.length > 1) {
		if (str.length > 5) {
			gap = 5;
		}
		var sine = str[gap].x - str[0].x;
		var cosine = str[gap].y - str[0].y;
		var length = Math.sqrt(sine * sine + cosine * cosine);
		if (length > 0) {
			sine /= length;
			cosine /= length;
			xoffset = -offsetlength * sine;
			yoffset = -offsetlength * cosine;
		}
	}
	this.mdbgHwImeGrid.drawText(x + xoffset, y + yoffset, stroke + 1, 14);
}
MdbgHwIme.prototype.getStrokeData = function() {
	var strokeData = new Array(this.sequence.length);
	for (var i = 0; i < this.sequence.length; ++i) {
		var stroke = new Array(this.sequence[i].length);
		for (var j = 0; j < this.sequence[i].length; ++j) {
			var coord = [this.sequence[i][j].x, this.sequence[i][j].y];
			stroke[j] = coord;
		}
		strokeData[i] = stroke;
	}
	return strokeData;
}
MdbgHwIme.prototype.toggleSimpTrad = function() {
	this.simpTrad = !this.simpTrad;
	if (this.simpTrad) {
		this.simpTradButton.addClass('selected');
	}
	else {
		this.simpTradButton.removeClass('selected');
	}
	//setCookie('mdbghwime-simptrad', this.simpTrad ? '1' : '0');
	this.sendStrokesToServer();
}
MdbgHwIme.prototype.toggleShowNumbers = function() {
	this.showNumbers = !this.showNumbers;
	if (this.showNumbers) {
		this.showNumbersButton.addClass('selected');
	}
	else {
		this.showNumbersButton.removeClass('selected');
	}
	//TODO: set cookie
	//setCookie('mdbghwime-show-numbers', this.showNumbers ? '1' : '0');
	this.mdbgHwImeGrid.clear();
	this.drawAll();
}

MdbgHwIme.prototype.adjustMdbgHwImeGridOffsets = function() {
	var canvas = $(this.mdbgHwImeGrid.element);
	
	var borderWidth = (canvas.outerWidth() - canvas.innerWidth()) / 2;
	
	this.mdbgHwImeGrid.offset_left = canvas.offset().left + borderWidth;
	this.mdbgHwImeGrid.offset_top = canvas.offset().top + borderWidth;
}
MdbgHwIme.prototype.getMdbgHwImeGridRelativeCoordinates = function(absolute) {
	var relative = new Object();
	relative.x = absolute.x - this.mdbgHwImeGrid.offset_left;
	relative.y = absolute.y - this.mdbgHwImeGrid.offset_top;
	return relative;
}
MdbgHwIme.prototype.postStrokeDataToServer = function(strokeData, callback) {
	this.postSeq++;
	var message = {
			width: this.mdbgHwImeGrid.size,
			height: this.mdbgHwImeGrid.size,
			lang: this.simpTrad ? 'zh_TW' : 'zh_CN',
			start: this.start,
			limit: this.limit,
			seq: this.postSeq,
			data: strokeData
	};
	var self = this;
	
	if (this.lastXhr != null && this.lastXhr.readyState < 4) {
		this.lastXhr.abort();
//		alert("aborted last request");
	}
	
	self.errorIndicator.fadeOut(0);
	this.loadingIndicator.fadeIn(100);
	this.lastXhr = $.ajax({
		type: 'POST',
		url: this.serverUrl,
		data: JSON.stringify(message),
		dataType: 'JSON',
		timeout: 20000,
		success: function(response) {
//			alert(self.postSeq);
//			alert(JSON.stringify(response));
			if (response.seq == self.postSeq) {
				self.start = response.start;
				self.limit = response.limit;
				self.total = response.total;
				self.updatePagers();
				callback(response.data);
			}
//			else {
//				alert('out of sequence');
//			}
		},
		error: function() {
			self.loadingIndicator.fadeOut(0);
			self.errorIndicator.fadeIn(0);
		}
	});
}
MdbgHwIme.prototype.resultCallback = function(reply) {
	this.loadingIndicator.fadeOut(100);
	if (reply == undefined || reply.matches.length == 0) {
		this.element.find('.mdbghwime-result > div').html('');
	}
	else {
		var table = $('<table cellspacing="0" cellpadding="0" />');

		for(var i = 0 ; i < reply.matches.length ; i++) {
			var match = reply.matches[i];
			
			var row = $('<tr />');
			table.append(row);
			if (i % 2) {
				row.addClass('odd');
			}
			else {
				row.addClass('even');
			}

			var tdChinese = $('<td />');
			row.append(tdChinese);
			var divChinese = $('<div class="hanzi" />');
			tdChinese.append(divChinese);
			
			var tdPronunciation = $('<td />');
			row.append(tdPronunciation);
			var divPronunciation = $('<div class="pron" />');
			tdPronunciation.append(divPronunciation);

			var tdDef = $('<td />');
			row.append(tdDef);
			var divDef = $('<div class="def" />');
			tdDef.append(divDef);

			var dictionaryMatch = reply.dictionaryMatches[match];
			if (dictionaryMatch) {
				divChinese.html(dictionaryMatch.ch);
				
				if (dictionaryMatch.ph != null) {
					divPronunciation.html(dictionaryMatch.ph);
					divPronunciation.prop('title', divPronunciation.text());
				}
				
				if (dictionaryMatch.d != null) {
					divDef.text(dictionaryMatch.d);
					divDef.prop('title', dictionaryMatch.d);
				}
			}
			else {
				divChinese.text(match);
			}
			
			var self = this;
			var onClickHandler = (function(char) {
				return function() {
					self.clearAll();
					self.onCharSelected(char);
				}
			})(match);
			
			tdChinese.click(onClickHandler);
			tdPronunciation.click(onClickHandler);
			tdDef.click(onClickHandler);
		}
		this.element.find('.mdbghwime-result > div').html(table);
	}
}
function MdbgHwImeGrid(element) {
	this.element = element;
	
	if (!this.element.getContext) {
		throw "Browser does not have canvas support";
	}
	
	this.size = element.width;
	
	this.context = this.element.getContext("2d");
	
	this.hasCanvasTextSupport = (typeof this.context.fillText == 'function');
	
	this.color = "#000000";
	this.lineWidth = 3.0;
}
MdbgHwImeGrid.prototype.clear = function() {
	this.context.clearRect(0, 0, this.size, this.size);

	this.color = "#c0c0c0";
	this.lineWidth = 2.5;

	// this.startLine(0, 0);
	// this.drawLine(this.size, this.size);
	// this.startLine(0, this.size);
	// this.drawLine(this.size, 0);

	this.startLine(0, (this.size) / 2.0);
	this.drawLine(this.size, (this.size) / 2.0);
	this.startLine((this.size) / 2.0, 0);
	this.drawLine((this.size) / 2.0, this.size);
	this.startLine((this.size )/4.0, (this.size)/4.0)
	this.drawLine((this.size)*3/4.0, (this.size)/4.0)
	this.startLine((this.size )/4.0, (this.size)*3/4.0)
	this.drawLine((this.size)*3/4.0, (this.size)*3/4.0)
};
MdbgHwImeGrid.prototype.startLine = function(x, y) {
	this.context.strokeStyle = this.color;
	this.context.lineCap="round";
	this.context.lineJoin="round";
	this.context.lineWidth = this.lineWidth;
	this.context.beginPath();
	this.context.moveTo(x, y);
};
MdbgHwImeGrid.prototype.drawLine = function(x, y) {
	this.context.setLineDash([5, 3])
	this.context.lineTo(x, y);
	this.context.stroke();
};
MdbgHwImeGrid.prototype.drawText = function(x, y, text, fontSizePx) {
	if (!this.hasCanvasTextSupport) {
		return;
	}
	this.context.font = "" + fontSizePx + "px sans-serif";
	this.context.fillStyle = this.color;
	x -= Math.round(this.context.measureText(text).width / 2);
	y += Math.round(fontSizePx / 2);
	this.context.fillText(text, x, y);
};



function getTouchPosition(event) {
	var touchobj = event.changedTouches[0];
	var x = touchobj.pageX;
	var y = touchobj.pageY;
	return {
		x: x,
		y: y
	};
}

function getPosition(event) {
	event = (event) ? event : ((event) ? event : null);
	var left = 0;
	var top = 0;
	if (event.pageX) {
		left = event.pageX;
		top = event.pageY;
	}
	else if (typeof(document.documentElement.scrollLeft) != undefined) {
		left = event.clientX + document.documentElement.scrollLeft;
		top = event.clientY + document.documentElement.scrollTop;
	}
	else {
		left = event.clientX + document.body.scrollLeft;
		top = event.clientY + document.body.scrollTop;
	}
	return {
		x: left,
		y: top
	};
}


// function getCookie(name, defaultValue) {
// 	defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue;
// 	var re = new RegExp(name + "=([^;]+)");
// 	var value = re.exec(document.cookie);
// 	return (value != null) ? unescape(value[1]) : defaultValue;
// }

// function setCookie(name, value) {
// 	var date = new Date();
// 	date.setTime((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365);
// 	document.cookie = escape(name) + '=' + escape(value) + ';expires=' + date.toGMTString();
// }


/*
 * Copyright (C) 2015 MDBG.NET
 * 
 * Based on:
 * 
 * Copyright (C) 2008 The Tegaki project contributors
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
MdbgHwIme.prototype.smooth = function() {
    /* Smoothing method based on a (simple) moving average algorithm. 
     *
     * Let p = p(0), ..., p(N) be the set points of this stroke, 
     *     w = w(-M), ..., w(0), ..., w(M) be a set of weights.
     *
     * This algorithm aims at replacing p with a set p' such as
     *
     *    p'(i) = (w(-M)*p(i-M) + ... + w(0)*p(i) + ... + w(M)*p(i+M)) / S
     *
     * and where S = w(-M) + ... + w(0) + ... w(M). End points are not
     * affected.
     */

    var weights = [1, 1, 2, 1, 1];	// Weights to be used
    var times = 1;						// Number of times to apply the algorithm

    if (this.sequence[this.strokeNum].length >= weights.length) {
        var offset = Math.floor(weights.length / 2);
        var sum = 0;

        for (var j = 0; j < weights.length; j++) {
            sum += weights[j];
        }

        for (var n = 1; n <= times; n++) {
            var s = jQuery.extend(true, {}, this.sequence[this.strokeNum]);

            for (var i = offset; i < this.sequence[this.strokeNum].length - offset; i++) {
                this.sequence[this.strokeNum][i].x = 0;
                this.sequence[this.strokeNum][i].y = 0;
                
                for (var j = 0; j < weights.length; j++) {
                    this.sequence[this.strokeNum][i].x += weights[j] * s[i + j - offset].x;
                    this.sequence[this.strokeNum][i].y += weights[j] * s[i + j - offset].y;
                }

                this.sequence[this.strokeNum][i].x = Math.round(this.sequence[this.strokeNum][i].x / sum);
                this.sequence[this.strokeNum][i].y = Math.round(this.sequence[this.strokeNum][i].y / sum);
            }
        }
    }
}
