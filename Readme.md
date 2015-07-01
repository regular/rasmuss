# Rasmuss
Remote ASeMbler Single Step

Executes machine code instructions on a remote host (possibly a different CPU architecture from your local machine), and outputs a line of JSON containing CPU register values for each step.

## Why?
I am using this to create test fixtures for an ARM32 CPU emulator. The emulator's test suite will initialize the emulated CPU's registers from the first line of `rasmuss`' output. Then it runs the emulation for the opcode in `nextInstruction` and compares the impact this has on the emulated CPU registers to what the real ARM CPU did running the same code inside a BananaPi connected via Ethernet. 

## Prerequisits
`gcc` and `gdb` need to be installed on the remote machine.

## Command Line Usage

Pipe assembler code into `rasmus` and specify the target machine and (optionally) a username.

__HINT__ set-up passwordless ssh authentication to save keystrokes.

``` bash
$ npm install -g rasmuss
$ cat demo.s
mov r0, #0x200
$ rasmuss regular@yellowbird < demo.s
{"nextInstruction":"0xe3a00c02","comment":"=> 0x8360 <main>:\tmov\tr0,,512\t; 0x200","registers":["0x1","0xbefffd54","0xbefffd5c","0x8360","0x0","0xbefffc18","0x82e9","0x0","0x0","0x0","0xb6fff000","0x0","0xb6f20dc1","0xbefffc08","0xb6f12cfb","0x8360","0x60000010"]}
{"nextInstruction":"0x43f8e92d","comment":"=> 0x8364 <__libc_csu_init>:\tstmdb\tsp!, {r3, r4, r5, r6, r7, r8, r9, lr}","registers":["0x200","0xbefffd54","0xbefffd5c","0x8360","0x0","0xbefffc18","0x82e9","0x0","0x0","0x0","0xb6fff000","0x0","0xb6f20dc1","0xbefffc08","0xb6f12cfb","0x8364","0x60000010"]}
```
*(notice the first register changing from 0x1 to 0x200)*

## Programmatic Usage

``` javascript
var rasmuss = require('./');

var target = 'regular@yellowbird';

var asm = [
    'mov r1, #0x320',
    'movs r2, r1, LSL #4'
].join('\n');

var stream = rasmuss(target, asm);
stream.pipe(process.stdout);
```

## License
MIT

