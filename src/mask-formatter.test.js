require('should');
var MaskFormatter = require('./mask-formatter');

describe('mask-formatter', function(){
	function test(p) {
		var processed = MaskFormatter.process(p.text, p.pattern, p.options);
		processed.formatted.should.be.eql(p.expected);
		processed.valid.should.be.eql(p.valid);
	}

	it('should format to pattern \'000.000.000-00\'', function(done) {
		var p = {
			text: '12345678980',
			pattern: '000.000.000-00',
			expected: '123.456.789-80',
			valid: true
		};
		test(p);
		p.options = {reverse: true};
		test(p);
		p.options = {reverse: false};
		p.text = '12345678a80';
		p.expected = '123.456.78';
		p.valid = false;
		test(p);
		p.options = {reverse: false, continuewheninvalid: true};
		p.text = '12a';
		p.expected = '12..-';
		p.valid = false;
		test(p);
		done();
	});

	it('should format date pattern \'00/00/0000\'', function(done) {
		var p = {
			text: '23111987',
			pattern: '90/90/9900',
			expected: '23/11/1987',
			valid: true
		};
		test(p);
		p = {
			text: '1187',
			pattern: '90/90/9900',
			expected: '1/1/87',
			valid: true
		};
		test(p);
		done();
	});

	it('should add placeholders \'000.000.000-00\'', function(done) {
		var p = {
			text: '1234',
			pattern: '000.000.000-00',
			expected: '123.4__.___-__',
			valid: false,
			options: {placeholder: '_', continuewheninvalid: true}
		};
		test(p);
		done();
	});

	it('should format to pattern \'990,00%\'', function(done) {
		var formatter = new MaskFormatter('990,00%');
		var processed = formatter.process('001');
		processed.formatted.should.be.eql('0,01%');
		processed.valid.should.be.eql(true);

		processed = formatter.process('12000');
		processed.formatted.should.be.eql('120,00%');
		processed.valid.should.be.eql(true);
		done();
	});

	it('should format to pattern \'+00 (00) 0000-0000\'', function(done) {
		var formatter = new MaskFormatter('+00 (00) 0000-0000');
		var processed = formatter.process('553122222222');
		processed.formatted.should.be.eql('+55 (31) 2222-2222');
		processed.valid.should.be.eql(true);
		done();
	});

	it('should format to pattern \'+00 (00) 90000-0000\'', function(done) {
		var p = {
			text: '553122222222',
			pattern: '+00 (00) 90000-0000',
			expected: '+55 (31) 2222-2222',
			valid: true
		};
		test(p);
		p.options = {reverse: true};
		test(p);
		p.options = {reverse: false};
		p.text = '5531322222222';
		p.expected = '+55 (31) 32222-2222';
		test(p);
		p.options = {reverse: true};
		test(p);

		done();
	});

	it('should format to pattern \'Cel.: $9000-0000\'', function(done) {
		var p = {
			text: '1942131',
			pattern: 'Cel.: $9000-0000',
			expected: 'Cel.: 9194-2131',
			valid: true
		};
		test(p);
		p.options = {reverse: true};
		test(p);
		done();
	});

	it('should format to pattern \'SS 00.000.000\'', function(done) {
		var p = {
			text: 'mg11862459',
			pattern: 'SS 00.000.000',
			expected: 'mg 11.862.459',
			valid: true
		};
		test(p);
		p.options = {reverse: true};
		test(p);
		done();
	});
});
