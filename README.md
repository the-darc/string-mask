[![npm version](https://badge.fury.io/js/string-mask.svg)](http://badge.fury.io/js/string-mask)
[![Bower version](https://badge.fury.io/bo/string-mask.svg)](http://badge.fury.io/bo/string-mask)
[![Build Status](https://travis-ci.org/the-darc/string-mask.svg?branch=master)](https://travis-ci.org/the-darc/string-mask)

#string-mask

A string formatter and validator based on masks.

## Installation ##

### With npm

```javascript
npm install --save string-mask
```

### With bower

```javascript
bower install --save string-mask
```

## Special mask's characters ##

Character | Description
--- | ---
`0` | Any numbers
`9` | Any numbers (Optional)
`#` | Any numbers (recursive)
`A` | Any aphanumeric character __Not implemented yet__
`a` | Any aphanumeric character (Optional) __Not implemented yet__
`S` | Any letter
`U` | Any letter (All lower case character will be mapped to uppercase)
`L` | Any letter (All upper case character will be mapped to lowercase)
`$` | Escape character, used to escape any of the special formatting characters.

## Usage ##

### Number ###

```javascript
	var formatter = new StringMask('#0');
	var result = formatter.apply('123'); // 123
```

### Two Decimal number with thousands separators###

```javascript
	var formatter = new StringMask('#.##0,00', {reverse: true});
	var result = formatter.apply('100123456'); // 1.001.234,56
	result = formatter.apply('6'); // 0,06
```

### Phone number ###

```javascript
	var formatter = new StringMask('+00 (00) 0000-0000');
	var result = formatter.apply('553122222222'); // +55 (31) 2222-2222
```

### Percentage ###

```javascript
	var formatter = new StringMask('#0,00%');
	var result = formatter.apply('001'); // 0,01%
```

### Brazilian CPF number ###

```javascript
	var formatter = new StringMask('000.000.000-00');
	var result = formatter.apply('12965815620'); // 129.658.156-20
```

### Date and time ###

```javascript
	var formatter = new StringMask('90/90/9900');
	var result = formatter.apply('1187'); // 1/1/87
```

### Convert Case ###

```javascript
	var formatter = new StringMask('UUUUUUUUUUUUU');
	var result = formatter.apply('To Upper Case'); // TO UPPER CASE
```

```javascript
	var formatter = new StringMask('LLLLLLLLLLLLL');
	var result = formatter.apply('To Lower Case'); // to lower case
```
