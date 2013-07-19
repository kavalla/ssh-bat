var ssh2 = require('ssh2'),
    colors = require('./colors');

var c = new ssh2();

exports.putFiles = function (servers, localPath, remotePath, srcServer, srcPath) {

};
exports.exec = function (servers, username, password, command) {

    for (var i = 0; i < servers.length; i++) {
        connection(servers[i], username, password, function (c) {
            c.exec(command, function (err, stream) {
                if (err) throw err;
                stream.on('data', function (data, extended) {
                    console.log("command exec success".rainbow, command);
                    console.log("%s ".yellow, new String(data));
                });
                stream.on('exit', function (code, signal) {
                    c.end();
                });
            });
        });
    }
};
function putFile(server, username, password, localPath, remotePath) {
    connection(server, username, password, function (c) {
        c.sftp(function (err, sftp) {
            if (err) throw err;
            sftp.on('end', function () {
                console.log('SFTP :: SFTP session closed');
            });
            sftp.fastPut(localPath, remotePath, function (err) {
                if (err) throw err;
                console.log("%s %s -> %s put success", server, localPath, remotePath);
                c.end();
            });
        });
    })
}
function connection(server, username, password, cb) {
    c.on('ready', function () {
        console.log('Connection :: ready '.rainbow, server);
        cb(c);
    });
    c.on('error', function (err) {
        console.log('Connection :: error :: %s'.red, err);
    });
    c.on('end', function () {
        console.log('Connection :: end'.rainbow);
        console.log('-----------------------------------------------------------------'.rainbow);
    });
    c.connect({
        host: server,
        port: 22,
        username: username,
        password: password
    });
}
function getFile(server, username, password, localPath, remotePath, cb) {
    connection(server, username, password, function (c) {
        c.sftp(function (err, sftp) {
            if (err) throw err;
            sftp.on('end', function () {
                console.log('SFTP :: SFTP session closed');
            });
            sftp.fastGet(remotePath, localPath, function (err) {
                if (err) throw err;
                c.end();
                cb();
            });
        });
    })
}