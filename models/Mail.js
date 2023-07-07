const path          = require('path');
const moment        = require('moment');
const fs            = require('fs').promises;
const randomstring  = require('randomstring');
const BASE_DIR      = path.dirname(require.main.filename);
const mongo         = new (require(BASE_DIR +'/helpers/MongoDriver'))();

class BioModels {
    async insertData(body) {
        let dateCreate = moment().toDate();

        body = {"_id": randomstring.generate(), ...body, dateCreate};
        
        let result = await mongo.insertData(process.env.APP_DATABASE_NAME, "mail", body);

        return (result) ? true : false;
    }
}

module.exports = BioModels;