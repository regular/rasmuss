var split = require('split');
var through = require('through');

module.exports = function(source) {
    var inRegisters = false;
    var inInstruction = false;
    var regs = [];
    var t = through(function(line) {
        if (line==='REGISTERS') {
            inRegisters = true;
            return;
        } else if (line === '/REGISTERS') {
            inRegisters = false;
            inInstruction = true;
            return;
        }
        if (inInstruction) {
            inInstruction = false;
            line = line.split(' #');
            var instruction = line[0];
            line.shift();
            var comment = line.join();
            this.push(JSON.stringify({
                nextInstruction: instruction,
                comment: comment,
                registers: regs
            }) + '\n');
            regs = [];
            return;
        }
        if (inRegisters) {
            line = line.split(/\s+/g)[1];
            regs.push(line);
        }
    });
    var s = split();
    source.pipe(s).pipe(t);
    return t;
};
