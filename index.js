var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var ejs = require('ejs');

var parseOutput = require('./lib/parse-gdb-output');

var template = ejs.compile(fs.readFileSync(path.join(__dirname, "remote.sh.ejs"), 'utf8'));

module.exports = function(target, asm) {
    var remoteScript = template({asm: asm});

    var ssh = spawn('ssh', [target, '"bash"']);

    ssh.on('close', function(exitCode) {
        if (exitCode !== 0) {
            stream.emit('error', new Error('remote execution failed'));
        }
    });

    ssh.stderr.pipe(process.stderr);

    var stream = parseOutput(ssh.stdout);

    ssh.stdin.write(remoteScript);
    ssh.stdin.end();

    return stream;
};
