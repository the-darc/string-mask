var StringMask = (function() {
	var tokens = {
		'0': {pattern: /\d/},
		'9': {pattern: /\d/, optional: true},
		'S': {pattern: /[a-zA-Z]/},
		'$': {escape: true} 
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
	var concatChar = function(text, character, options) {
		if (options.reverse) return character + text;
		return text + character;
	};
	var StringMask = function(pattern, opt) {
		this.options = opt || {};
		this.options = {
			continuewheninvalid: this.options.continuewheninvalid || false,
			reverse: this.options.reverse || false,
			placeholder: this.options.placeholder === undefined ||
						 this.options.placeholder === null ? '' : this.options.placeholder
		};
		this.pattern = pattern;

		StringMask.prototype.process = function proccess(value) {
			var valid = true;
			var formatted = '';
			var valuePos = this.options.reverse ? value.length - 1 : 0;
			var optionalNumbersToUse = calcOptionalNumbersToUse(this.pattern, value);
			var escapeNext = false;

			var steps = {
				start: this.options.reverse ? this.pattern.length - 1 : 0,
				end: this.options.reverse ? -1 : this.pattern.length,
				inc: this.options.reverse ? -1 : 1
			};

			for (var i = steps.start; i !== steps.end; i = i + steps.inc) {
				var pc = this.pattern.charAt(i);
				var vc = value.charAt(valuePos);
				var token = tokens[pc];

				if (this.options.reverse && isEscaped(this.pattern, i)) {
					formatted = concatChar(formatted, pc, this.options);
					i = i + steps.inc;
					continue;
				} else if (!this.options.reverse && escapeNext) {
					formatted = concatChar(formatted, pc, this.options);
					escapeNext = false;
					continue;
				} else if (!this.options.reverse && token && token.escape) {
					escapeNext = true;
					continue;
				}

				if (!token) {
					formatted = concatChar(formatted, pc, this.options);
				} else if (token.optional) {
					if (token.pattern.test(vc) && optionalNumbersToUse) {
						formatted = concatChar(formatted, vc, this.options);
						valuePos = valuePos + steps.inc;
						optionalNumbersToUse--;
					}
				} else if (token.pattern.test(vc)) {
					formatted = concatChar(formatted, vc, this.options);
					valuePos = valuePos + steps.inc;
				} else if (!this.options.continuewheninvalid) {
					valid = false;
					break;
				} else {
					formatted = concatChar(formatted, this.options.placeholder, this.options);
					valuePos = valuePos + steps.inc;
					valid = false;
				}
			}
			return {result: formatted, valid: valid};
		};

		StringMask.prototype.apply = function(value) {
			return this.process(value).result;
		};

		StringMask.prototype.validate = function(value) {
			return this.process(value).valid;
		};
	};

	StringMask.process = function(value, pattern, options) {
		return new StringMask(pattern, options).process(value);
	};

	StringMask.apply = function(value, pattern, options) {
		return new StringMask(pattern, options).apply(value);
	};

	StringMask.validate = function(value, pattern, options) {
		return new StringMask(pattern, options).validate(value);
	};

	return StringMask;
}());

/** Used to determine if values are of the language type Object */
var objectTypes = {
	'boolean': false,
	'function': true,
	'object': true,
	'number': false,
	'string': false,
	'undefined': false
};

if (objectTypes[typeof module]) {
	module.exports = StringMask;	
}
