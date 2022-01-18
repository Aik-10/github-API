require('module-alias/register');
require('dotenv').config();

const apiExpress = require('@api/index')
const apiHandler = require('@handler/apiHandler')

class Api {
  constructor() {

    (async () => {
        this.config = require('@root/config');
        this.log = require('@root/logger');
        
        this.log.info('Api Server starting...');

        this.apiHandler = new apiHandler(this);
        
        this.api = new apiExpress(this);
    })();

  }
}
new Api()