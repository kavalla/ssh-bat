ssh-bat
=======
ssh = require(‘ssh-bat');

ssh.exec(["192.168.1.1"], "root", "123123", "uptime");

ssh.putLocalFiles(["192.168.1.1"], "root", "123123", "/root/linux-3.9.4.tar.gz", "/root/linux-3.9.4.tar.gz");
