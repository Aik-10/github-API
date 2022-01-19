const { exec } = require("child_process");
const config = require('@root/config');

exports.execCommand = async(command) => {
    if (!command) return;

    return new Promise((resolve, reject) => {
        exec(command, {
            cwd: config.files.root
        }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}