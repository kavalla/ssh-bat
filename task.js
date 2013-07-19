var rootpath = process.cwd() + '/',
ssh = require(rootpath + 'ssh');


ssh.exec(["10.168.100.189"], "root", "autohome123", "uptime");