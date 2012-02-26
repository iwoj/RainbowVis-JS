/*
RainbowVis-JS by Sophiah (Zing-Ming)
Released under MIT License
*/

function Rainbow()
{
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw 'Rainbow must have two or more colours.';
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
		}
	}

	this.setSpectrum = function () 
	{
		setColours(arguments);
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
	}

	this.colourAt = function (number)
	{
		if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = 0;
			if (minNum < 0) {
				index = Math.min(Math.floor((number - minNum)/segment), gradients.length - 1);
			} else {
				index = Math.min(Math.floor(number/segment), gradients.length - 1);
			}
			return gradients[index].colourAt(number);
		}
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw 'maxNumber(' + maxNumber + ') is not greater than minNumber(' + minNumber + ')';
		}
	}
}

function ColourGradient() 
{
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw 'maxNumber(' + maxNumber + ') is not greater than minNumber(' + minNumber + ')';
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number,'red') + calcHex(number,'green') + calcHex(number,'blue');
	}
	
	function calcHex(number, channel)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = 0;
		var cEnd_Base10 = 0;
		if (channel == 'red') {
			cStart_Base10 = parseInt(startColour.substring(0,2), 16);
			cEnd_Base10 =  parseInt(endColour.substring(0,2), 16);
		} else if (channel == 'green') {
			cStart_Base10 = parseInt(startColour.substring(2,4), 16);
			cEnd_Base10 =  parseInt(endColour.substring(2,4), 16);
		} else if (channel == 'blue') {
			cStart_Base10 = parseInt(startColour.substring(4,6), 16);
			cEnd_Base10 =  parseInt(endColour.substring(4,6), 16);
		} 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	formatHex = function (hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-f]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var colourNames =
			[
				['red', 'ff0000'],
				['lime', '00ff00'],
				['blue', '0000ff'],
				['yellow', 'ffff00'],
				['aqua', '00ffff'],
				['fuchsia', 'ff00ff'],
				['white', 'ffffff'],
				['black', '000000'],
				['gray', '808080'],
				['grey', '808080'],
				['silver', 'c0c0c0'],
				['maroon', '800000'],
				['olive', '808000'],
				['green', '008000'],
				['teal', '008080'],
				['navy', '000080'],
				['purple', '800080']
			];
			for (var i = 0; i < colourNames.length; i++) {
				if (string.toLowerCase() === colourNames[i][0]) {
					return colourNames[i][1];
				}
			}
			throw string + ' is not a valid colour.';
		}
	}
}

