const exec = require('child_process').exec;

module.exports = class ApiHandler {
    constructor(api) {
        this.api = api;
    }

    async actionHandler(body) {

        this.api.log.info(`${body?.repository?.name} new event in branch ${body?.ref.replaceAll('refs/heads/', '').toUpperCase()}, by user ${body?.sender?.login}!`)

        if ( !body?.repository?.master_branch ) body.repository.master_branch = body?.master_branch;

        if( body?.repository?.master_branch.toUpperCase() === body?.ref.replaceAll('refs/heads/', '').toUpperCase()) {
            console.log("master")


            
            /* exec("git init", function(_err, stdout, stderr) {
                if (_err) console.error(_err);

                console.log(stdout);
            }); */
        }
    }
}