#!/usr/bin/env node

var concat = require('concat-stream');
var rasmuss = require('../');

if (process.argv.length < 3) {
    console.error(
        'Usage: rasmuss [username@]host\n' +
        '\n' +
        'Reads assembler instructions from stdin, runs those instructions on the specified remote host (via ssh and gdb) and outputs a step-by-step trace of the CPU registers.\n' +
        '\n' +
        'Requires gcc and gdb to be installed on the remote host.' +
        '\n'
    );
}

var target = process.argv[2];

process.stdin.pipe(concat(function(asm) {
    console.log(asm);
    rasmuss(target, asm).pipe(process.stdout);
}));

