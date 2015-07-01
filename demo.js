var rasmuss = require('./');

var target = 'regular@yellowbird';

var asm = [
    'mov r1, #0x320',
    'movs r2, r1, LSL #4'
].join('\n');

var stream = rasmuss(target, asm);
stream.pipe(process.stdout);
