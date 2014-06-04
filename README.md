mask-formatter
##############

A string formatter and validator based on Excel like masks.

## Installation ##

```javascript
npm install --save mask-formatter
```

## Special mask's characters ##

Character | Description
--- | ---
`0` | Any numbers
`9` | Any numbers (Optional)
`#` | Any numbers (recursive) __Not implemented yet__
`A` | Any aphanumeric character __Not implemented yet__
`a` | Any aphanumeric character (Optional) __Not implemented yet__
`S` | Any letter
`U` | Any letter (All lower case character will be mapped to uppercase) __Not implemented yet__
`L` | Any letter (All upper case character will be mapped to lowercase) __Not implemented yet__
`$` | Escape character, used to escape any of the special formatting characters.

## Usage ##

__TODO: Description of the api__

### Number ###

```javascript
// TODO - sample code here
```

### Two Decimal number ###

```javascript
// TODO - sample code here
```

### Phone number ###

```javascript
	var formatter = new MaskFormatter('+00 (00) 0000-0000');
	var processed = formatter.format('553122222222'); // +55 (31) 2222-2222
```

### Percentage ###

```javascript
	var formatter = new MaskFormatter('990,00%');
	var processed = formatter.format('001'); // 0,01%
```

### Brazilian CPF number ###

```javascript
	var formatter = new MaskFormatter('000.000.000-00');
	var cpf = formatter.format('12965815620'); // 129.658.156-20
```

### Date and time ###

```javascript
	var formatter = new MaskFormatter('90/90/9900');
	var cpf = formatter.format('1187'); // 1/1/87
```
