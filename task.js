﻿var rootpath = process.cwd() + '/',
ssh = require(rootpath + 'ssh');


ssh.exec(["10.168.100.189"], "root", "autohome123", "uptime");

ssh.putLocalFiles(["10.168.100.189"], "root", "autohome123", "/root/linux-3.9.4.tar.gz", "/root/linux-3.9.4.tar.gz");