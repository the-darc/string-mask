var should = require('should');
var StringMask = require('../src/string-mask');

describe('mask-formatter', function() {
    function test(p) {
        var processed = StringMask.process(p.text, p.pattern, p.options);
        processed.result.should.be.eql(p.expected);
        processed.valid.should.be.eql(p.valid);
    }

    describe('number:', function() {
        var p = {
            text: '7612345678980',
            pattern: '#.##0,00',
            expected: '76.123.456.789,80',
            valid: true,
            options: {reverse: true}
        };
        it('reverse \'#.##0,00\' should format \'7612345678980\' to \'76.123.456.789,80\'', function(done) {
            test(p);
            done();
        });
        it('reverse \'#.##0,00\' should format \'112\' to \'1,12\'', function(done) {
            p.text = '112';
            p.expected = '1,12';
            test(p);
            done();
        });
        it('reverse \'#.##0,00\' should format \'12345678a80\' to \',80\' and be invalid', function(done) {
            p.text = '12345678a80';
            p.expected = ',80';
            p.valid = false;
            test(p);
            done();
        });
        it('reverse \'#.##0\' should format \'123456789\' to \'123.456.789\'', function(done) {
            p.pattern = '#.##0';
            p.text = '123456789';
            p.expected = '123.456.789';
            p.valid = true;
            test(p);
            done();
        });
        it('reverse \'#0\' should format \'123456788\' to \'123456788\'', function(done) {
            p.pattern = '#0';
            p.text = '123456788';
            p.expected = '123456788';
            p.valid = true;
            test(p);
            done();
        });
        it('reverse \'#,0\' should format \'123456788\' to \'12345678,8\'', function(done) {
            p.pattern = '#,0';
            p.text = '123456788';
            p.expected = '12345678,8';
            p.valid = true;
            test(p);
            done();
        });
        it('reverse \'#.##0,00\' should format \'1\' to \'0,01\'', function(done) {
            test({
                text: '1',
                pattern: '#.##0,00',
                expected: '0,01',
                valid: true,
                options: {reverse: true}
            });
            done();
        });
    });

    describe('percentage:', function() {
        var p = {
            text: '7612345678980',
            pattern: '#.##0,00 %',
            expected: '76.123.456.789,80 %',
            valid: true,
            options: {reverse: true}
        };
        it('reverse \'#.##0,00 %\' should format \'7612345678980\' to \'76.123.456.789,80 %\'', function(done) {
            test(p);
            done();
        });
        it('reverse \'#.##0,00 %\' should format \'123a4567810\' to \'45.678,10 %\' and be invalid', function(done) {
            p.text = '123a4567810';
            p.expected = '45.678,10 %';
            p.valid = false;
            test(p);
            done();
        });
        it('reverse \'#0,00%\' should format \'1234567810\' to \'12345678,10%\' and be invalid', function(done) {
            p.pattern = '#0,00%';
            p.text = '1234567810';
            p.expected = '12345678,10%';
            p.valid = true;
            test(p);
            done();
        });
        it('\'0,#\' should format \'1234567\' to \'1,234567\'', function(done) {
            p.pattern = '0,#';
            p.text = '1234567';
            p.expected = '1,234567';
            p.valid = true;
            p.options = {reverse: false};
            test(p);
            done();
        });
    });

    describe('money:', function() {
        var p = {
            text: '7612345678980',
            pattern: 'R$ #.##0,00',
            expected: 'R$ 76.123.456.789,80',
            valid: true,
            options: {reverse: true}
        };
        it('reverse \'R$ #.##0,00\' should format \'7612345678980\' to \'R$ 76.123.456.789,80\'', function(done) {
            test(p);
            done();
        });
        it('reverse \'R$ #.##0,00\' should format \'100\' to \'R$ 1,00\'', function(done) {
            p.text = '100';
            p.expected = 'R$ 1,00';
            test(p);
            done();
        });
        it('reverse \'R$ #.##0,00\' should format \'1\' to \'R$ 0,01\'', function(done) {
            p.text = '1';
            p.expected = 'R$ 0,01';
            test(p);
            done();
        });
        it('reverse \'R$ #.##0,00\' should format \'123a4567810\' to \'45.678,10\' and be invalid', function(done) {
            p.text = '123a4567810';
            p.expected = '45.678,10';
            p.valid = false;
            test(p);
            done();
        });
        it('reverse \'$ #,##0.000\' should format \'7612345678980\' to \'$ 7,612,345,678.980\'', function(done) {
            p.pattern = '$ #,##0.000';
            p.text = '7612345678980';
            p.expected = '$ 7,612,345,678.980';
            p.valid = true;
            test(p);
            done();
        });
    });

    describe('CPF:', function() {
        var p = {
            text: '12345678980',
            pattern: '000.000.000-00',
            expected: '123.456.789-80',
            valid: true
        };
        it('\'000.000.000-00\' should format \'12345678980\' to \'123.456.789-80\'', function(done) {
            test(p);
            done();
        });
        it('reverse \'000.000.000-00\' should format \'12345678980\' to \'123.456.789-80\'', function(done) {
            p.options = {reverse: true};
            test(p);
            done();
        });
        it('\'000.000.000-00\' should format \'12345678a80\' to \'123.456.78\'', function(done) {
            p.options = {reverse: false};
            p.text = '12345678a80';
            p.expected = '123.456.78';
            p.valid = false;
            test(p);
            done();
        });
    });

    describe('Date:', function() {
        var p = {
            text: '23111987',
            pattern: '90/90/9900',
            expected: '23/11/1987',
            valid: true
        };
        it('\'90/90/9900\' should format \'23111987\' to \'23/11/1987\'', function(done) {
            test(p);
            done();
        });
        it('\'90/90/9900\' should format \'1187\' to \'1/1/87\'', function(done) {
            p.text = '1187';
            p.expected = '1/1/87';
            test(p);
            done();
        });
    });

    describe('phone:', function() {
        it('\'+00 (00) 0000-0000\' should format \'553122222222\' to \'+55 (31) 2222-2222\'', function(done) {
            var formatter = new StringMask('+00 (00) 0000-0000');
            var processed = formatter.process('553122222222');
            processed.result.should.be.eql('+55 (31) 2222-2222');
            processed.valid.should.be.eql(true);
            done();
        });

        var p = {
            text: '553122222222',
            pattern: '+00 (00) 90000-0000',
            expected: '+55 (31) 2222-2222',
            valid: true
        };
        it('\'+00 (00) 90000-0000\' should format \'553122222222\' to \'+55 (31) 2222-2222\'', function(done) {
            test(p);
            done();
        });
        it('reverse \'+00 (00) 90000-0000\' should format \'553122222222\' to \'+55 (31) 2222-2222\'', function(done) {
            p.options = {reverse: true};
            test(p);
            done();
        });
        it('\'+00 (00) 90000-0000\' should format \'5531622222222\' to \'+55 (31) 62222-2222\'', function(done) {
            p.options = {reverse: false};
            p.text = '5531622222222';
            p.expected = '+55 (31) 62222-2222';
            test(p);
            done();
        });
        it('\'+00 (00) 90000-0000\' should format \'5531622222222\' to \'+55 (31) 62222-2222\'', function(done) {
            p.options = {reverse: true};
            test(p);
            done();
        });
    });

    describe('RG:', function() {
        var p = {
            text: 'mg11862459',
            pattern: 'SS 00.000.000',
            expected: 'mg 11.862.459',
            valid: true
        };
        it('\'SS 00.000.000\' should format \'mg11862459\' to \'mg 11.862.459\'', function(done) {
            test(p);
            done();
        });
        it('reverse \'SS 00.000.000\' should format \'mg11862459\' to \'mg 11.862.459\'', function(done) {
            p.options = {reverse: true};
            test(p);
            done();
        });
    });

    describe('Case:', function() {
        it('\'UUUUUUU\' should format \'Testing\' to \'TESTING\'', function(done) {
            test({
                text: 'Testing',
                pattern: 'UUUUUUU',
                expected: 'TESTING',
                valid: true
            });
            done();
        });
        it('\'LLLLLLL\' should format \'Testing\' to \'testing\'', function(done) {
            test({
                text: 'Testing',
                pattern: 'LLLLLLL',
                expected: 'testing',
                valid: true
            });
            done();
        });
    });

    describe('Scientific notations:', function() {
        it('\'0.00E#\' should format \'12310\' to \'1.23E10\'', function(done) {
            test({
                text: '12310',
                pattern: '0.00E#',
                expected: '1.23E10',
                valid: true
            });
            done();
        });
        it('\'0.0E#\' should format \'12310\' to \'1.2E310\'', function(done) {
            test({
                text: '12310',
                pattern: '0.0E#',
                expected: '1.2E310',
                valid: true
            });
            done();
        });
        it('\'0.000E#\' should format \'123\' to \'1.23\'', function(done) {
            test({
                text: '123',
                pattern: '0.000E#',
                expected: '1.23',
                valid: false
            });
            done();
        });
    });

    describe('Iban:', function() {
        it('\'UUAA AAAA AAAA AAAA AAAA AAAA AAA\' should format \'FR761111900069410000AA33222\' ' +
           'to \'FR76 1111 BBBB 6941 0000 AA33 222\'', function(done) {
            test({
                text: 'FR761111BBBB69410000AA33222',
                pattern: 'UUAA AAAA AAAA AAAA AAAA AAAA AAA',
                expected: 'FR76 1111 BBBB 6941 0000 AA33 222',
                valid: true
            });
            done();
        });
        it('\'UUAA AAAA AAAA AAAA AAAA AAAA AAA\' should format \'FR761111900069410000AA33222\' to ' +
           '\'FR76 1111 BBBB 6941 0000 AA33\'', function(done) {
            test({
                text: 'FR761111BBBB69410000AA-3222',
                pattern: 'UUAA AAAA AAAA AAAA AAAA AAAA AAA',
                expected: 'FR76 1111 BBBB 6941 0000 AA',
                valid: false
            });
            done();
        });
    });

    describe('Other usages:', function() {
        it('Should run validate', function(done) {
            should(StringMask.validate('mg11862459', 'SS 00.000.000')).be.ok;
            should(StringMask.validate('1011862459', 'SS 00.000.000')).be.not.ok;
            done();
        });
        it('Should apply mask', function(done) {
            should(StringMask.apply('mg11862459', 'SS 00.000.000')).be.eql('mg 11.862.459');
            done();
        });
        it('Should not apply mask on empty values', function(done) {
            should(StringMask.apply('', 'SS 00.000.000')).be.eql('');
            should(StringMask.apply(null, 'SS 00.000.000')).be.eql('');
            should(StringMask.apply(undefined, 'SS 00.000.000')).be.eql('');
            done();
        });
        it('should not escape in the recursive portion of pattern', function(done) {
            should(StringMask.apply('123', 'YZ #.##0,00', {reverse: true})).be.eql('YZ 1,23');
            should(StringMask.apply('123', 'YZ#.##0,00', {reverse: true})).be.eql('YZ1,23');
            should(StringMask.apply('123', 'US #.##0,00', {reverse: true})).be.eql('US 1,23');
            should(StringMask.apply('123', 'US.#.##0,00', {reverse: true})).be.eql('US.1,23');
            should(StringMask.apply('123456789', 'US #,##0.00', {reverse: true})).be.eql('US 1,234,567.89');
            should(StringMask.apply('123456789', '$U$S #,##0.00', {reverse: true})).be.eql('$U$S 1,234,567.89');

            should(StringMask.apply('123', '00,# YZ')).be.eql('12,3 YZ');
            should(StringMask.apply('123', '00,0##.# US')).be.eql('12,3 US');
            should(StringMask.apply('123456789', '00,0##.# US')).be.eql('12,345.678.9 US');
            should(StringMask.apply('123456789', '00,0##.# $U$S')).be.eql('12,345.678.9 $U$S');

            should(StringMask.apply('123456789', '#L##0,00', {reverse: true})).be.eql('1L234L567,89');
            done();
        });
        it('should work with escaped tokens', function(done) {
            should(StringMask.apply('125', '$##')).be.eql('#125');
            should(StringMask.apply('125', '#$#', {reverse: true})).be.eql('125#');
            should(StringMask.apply('JUSTTEST', 'AAAA $A AAAA')).be.eql('JUST A TEST');

            should(StringMask.process('125a123', '$##')).be.eql({result: '#125', valid: false});

            done();
        });
    });
});
