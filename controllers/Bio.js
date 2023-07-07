const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const message       = require(BASE_DIR +'/config/Messages.json');
const utils         = new (require(BASE_DIR +'/helpers/Utils'))();
const Bio           = new (require(BASE_DIR +'/models/Bio'))();

class BioController {
    async getData(req, res) {
        let response = {...message.ERR_RESPONSE};
        let checkParam = await utils.requiredParams(req, ["bioId"]);
        
        if(!checkParam) return res.send({...message.ERR_BAD_REQUEST}).status(400);

        let result = await Bio.getData(req.query);

        response = (result) ? {...message.SUCCESS_RESPONSE} : {...message.SUCCESS_DATA_NOT_FOUND};
        response['content'] = (result) ? result : {};

        return res.send(response).status(200);
    }

    async createBio(req, res) {
        let response = {...message.ERR_RESPONSE};
        let checkParam = await utils.requiredParams(req, ["name", "description", "photo", "skills"]);
        if(!checkParam) return res.send({...message.ERR_BAD_REQUEST}).status(400);

        if(typeof req.body.photo !== "object") return res.send({...message.ERR_BAD_REQUEST}).status(400);
        if(typeof req.body.skills !== "object") return res.send({...message.ERR_BAD_REQUEST}).status(400);
        req.body.name = req.body.name.replaceAll(/<(.+?)>/g, '');

        let result = await Bio.insertData(req.body);

        if(result) {
            response = {...message.SUCCESS_RESPONSE};
            res.status(200);
        } else {
            res.status(400)
        }
        
        return res.send(response);
    }
}

module.exports = BioController;