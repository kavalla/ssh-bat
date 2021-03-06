﻿var ssh2 = require('ssh2'),
    colors = require('./colors');


exports.putLocalFiles = function (servers, username, password, localPath, remotePath) {
    for (var i = 0; i < servers.length; i++) {
        putFile(servers[i], username, password, localPath, remotePath);
    }
}
exports.putRemoteFiles = function (servers,username,password, localPath, remotePath, srcServer, srcPath) {
    getFile(srcServer, username, password, localPath, srcPath, function () {
        putLocalFiles(servers, username, password, localPath, remotePath);
    })
};
exports.exec = function (servers, username, password, command) {
    for (var i = 0; i < servers.length; i++) {
        connection(servers[i], username, password, function (c) {
            c.exec(command, function (err, stream) {
                if (err) throw err;
                stream.on('data', function (data, extended) {
                    console.log("command exec success".rainbow, command);
                    console.log(" ", (new String(data)).yellow);
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
                //console.log('SFTP :: SFTP session closed'.rainbow);
            });
            
            sftp.fastPut(localPath, remotePath, function (err) {
                if (err) throw err;
                console.log("%s %s -> %s put success".yellow, server, localPath, remotePath);
                sftp.end();
                c.end();
            }); 
        });  
    })
}
function connection(server, username, password, cb) {
    var c = new ssh2();
    c.on('ready', function () {
        //console.log('Connection :: ready '.rainbow, server);
        cb(c);
    });
    c.on('error', function (err) {
        console.log('Connection :: error :: %s'.red, err);
    });
    c.on('end', function () {
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
                sftp.end();
                c.end();
                cb();
            });
        });
    })
}