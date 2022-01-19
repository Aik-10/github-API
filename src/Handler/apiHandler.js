const {execCommand} = require('./execHandler');

module.exports = class ApiHandler {
    constructor(api) {
        this.api = api;
    }

    async handleStatus(body) {
        if ( (this.api.config.files.PushFiles).length > 0 ) {

            let files = []

            const gitStatus = await execCommand(`git status -s`);
            const arrayStatus = gitStatus.split(/\r?\n/);
            
            if ( !arrayStatus.length > 0 ) return;
             
            this.api.log.info(`${body?.repository?.name} has uncommited files, skipping push before pull!`);

            arrayStatus.map( line => {
                (this.api.config.files.PushFiles).map(async file => {
                    const val = line.search(`${file}`);
                    if ( val != -1 ) {
                        this.api.log.info(`${file} found in git status, Committing before pull!`);
                        files.push(`${file}`);
                    }
                })
            });
            return(files);
        }
    }

    async handleGitAdd(files) {
        if ( !files.length > 0 ) return;

        const gitAdd = await execCommand(`git add ${files.join(' ')}`);
        return gitAdd;
    }

    async handleGitCommitAndPush(branch) {
        await execCommand(`git commit -m "Automatic" -m "hide"`);
        await execCommand(`git push origin ${branch}`);
        return;
    }

    async handleGitPull() {
        await execCommand(`git fetch --all -q`);
        await execCommand(`git pull -q`);
    }

    async actionHandler(body) {

        this.api.log.info(`${body?.repository?.name} new event in branch ${body?.ref.replaceAll('refs/heads/', '').toUpperCase()}, by user ${body?.sender?.login}!`)

        if ( !body?.repository?.master_branch ) body.repository.master_branch = body?.master_branch;

        if( body?.repository?.master_branch.toUpperCase() === body?.ref.replaceAll('refs/heads/', '').toUpperCase()) {
            const files = await this.handleStatus(body);


            /* currentBranch == (master / main / development) */
            const currentBranch = await execCommand(`git branch --show-current`);

            await this.handleGitPull();

            if ( files.length > 0 ) {
                await this.handleGitAdd(files);

                await this.handleGitCommitAndPush(`${currentBranch}`);

                this.api.log.info(`${body?.repository?.name} files commit and push to ${currentBranch}!`)
            }
        }
    }
}

