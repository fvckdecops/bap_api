const path          = require('path');
const moment        = require('moment');
const fs            = require('fs').promises;
const randomstring  = require('randomstring');
const BASE_DIR      = path.dirname(require.main.filename);
const mongo         = new (require(BASE_DIR +'/helpers/MongoDriver'))();

class BioModels {
    async getData(body) {
        let clause = {"_id": body.bioId}
        let result = await mongo.searchData(process.env.APP_DATABASE_NAME, "bio", clause);
        
        return (result.length) ? result[0] : false;
    }

    async insertData(body) {
        let dateCreate = moment().toDate();

        let ext = '';
        let path = BASE_DIR +'/public/images/profile/';

        switch(body.photo.mimeType) {
            case "image/png":
                ext = ".png";
                break;
            case "image/webp":
                ext = ".webp";
                break;
            default:
                ext = ".jpeg"
        }

        let fileName = body.photo.fileName.split('.')[0] + ext;

        try {
            await fs.access(path);
            await fs.writeFile(path + fileName, body.photo.data, 'base64');
        } catch(err) {
            await fs.mkdir(path, { recursive: true });
            await fs.writeFile(path + fileName, body.photo.data, 'base64');
        }

        body = {"_id": randomstring.generate(), ...body, "photo": fileName, dateCreate, dateUpdate: null};
        
        let result = await mongo.insertData(process.env.APP_DATABASE_NAME, "bio", body);

        return (result) ? true : false;
    }
}

module.exports = BioModels;