const express = require("express");
const crypto = require('crypto');

module.exports = class ApiExpress {
    constructor(api) {
        this.api = api;

        (async () => {
            if( !process.env.GIT_SECRET || process.env.GIT_SECRET === '') { 
                this.api.log.error(`.env GIT_SECRET not set (API closed automatically)`);
                process.exit(1);
            }

            this.api.app = express();

            this.api.app.use(express.json());
            this.api.app.get('*', (_r,res) => res.status(404).end());

            this.api.app.post('/git', async (req, res) => {
                let signature = req.headers["x-hub-signature"];
                if (!signature) {
                    res.status(400).end("You must provide a signature header.");
                    return;
                }

                if (!await this.handleVerifySignature(req)) {
                    res.status(400).end("You must specify a valid signature");
                    return;
                }

                res.status(200).end("received");
                this.api.log.info(`GitHub webhook received`);

                this.api.apiHandler.actionHandler(req?.body);
            });

            this.api.app.listen(`${ process.env.WEB_PORT || 8080 }`, () => {
                this.api.log.info(`Api server started on port ${ process.env.WEB_PORT || 8080 }`);
            });
        })();
    }

    async handleVerifySignature(req) {
        const hmac = crypto.createHmac('sha1', process.env.GIT_SECRET);
        const digest = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;
        return req.headers['x-hub-signature'] === digest;
    }
}