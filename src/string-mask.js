
var StringMask = function(pattern, opt) {
	var tokens = {
		'0': {pattern: /\d/},
		'9': {pattern: /\d/, optional: true},
		'S': {pattern: /[a-zA-Z]/},
		'$': {escape: true} 
	};
	var options = opt || {};
	options = {
		continuewheninvalid: options.continuewheninvalid || false,
		reverse: options.reverse || false,
		placeholder: options.placeholder === undefined || options.placeholder === null ? '' : options.placeholder
	};

	var isEscaped = function(pattern, pos) {
		var count = 0;
		var i = pos - 1;
		var token = {escape: true};
		while (i >= 0 && token && token.escape) {
			token = tokens[pattern.charAt(i)];
			count += token && token.escape ? 1 : 0;
			i--;
		}
		return count > 0 && count%2 === 1;	
	};

	var calcOptionalNumbersToUse = function(pattern, value) {
		var numbersInP = pattern.replace(/[^0]/g,'').length;
		var numbersInV = value.replace(/[^\d]/g,'').length;
		return numbersInV - numbersInP;
	};

	var concatChar = function(text, character) {
		if (options.reverse) return character + text;
		return text + character;
	};

	StringMask.prototype.process = function proccess(value) {
		var valid = true;
		var formatted = '';
		var valuePos = options.reverse ? value.length - 1 : 0;
		var optionalNumbersToUse = calcOptionalNumbersToUse(pattern, value);
		var escapeNext = false;

		var steps = {
			start: options.reverse ? pattern.length - 1 : 0,
			end: options.reverse ? -1 : pattern.length,
			inc: options.reverse ? -1 : 1
		};

		for (var i = steps.start; i !== steps.end; i = i + steps.inc) {
			var pc = pattern.charAt(i);
			var vc = value.charAt(valuePos);
			var token = tokens[pc];

			if (options.reverse && isEscaped(pattern, i)) {
				formatted = concatChar(formatted, pc);
				i = i + steps.inc;
				continue;
			} else if (!options.reverse && escapeNext) {
				formatted = concatChar(formatted, pc);
				escapeNext = false;
				continue;
			} else if (!options.reverse && token && token.escape) {
				escapeNext = true;
				continue;
			}

			if (!token) {
				formatted = concatChar(formatted, pc);
			} else if (token.optional) {
				if (token.pattern.test(vc) && optionalNumbersToUse) {
					formatted = concatChar(formatted, vc);
					valuePos = valuePos + steps.inc;
					optionalNumbersToUse--;
				}
			} else if (token.pattern.test(vc)) {
				formatted = concatChar(formatted, vc);
				valuePos = valuePos + steps.inc;
			} else if (!options.continuewheninvalid) {
				valid = false;
				break;
			} else {
				formatted = concatChar(formatted, options.placeholder);
				valuePos = valuePos + steps.inc;
				valid = false;
			}
		}
		return {formatted: formatted, valid: valid};
	};

	StringMask.prototype.format = function(value) {
		return this.process(value).formatted;
	};

	StringMask.prototype.validate = function(value) {
		return this.process(value).valid;
	};
};

StringMask.process = function(value, pattern, options) {
	return new StringMask(pattern, options).process(value);
};

StringMask.format = function(value, pattern, options) {
	return new StringMask(pattern, options).format(value);
};

StringMask.validate = function(value, pattern, options) {
	return new StringMask(pattern, options).validate(value);
};

module.exports = StringMask;
