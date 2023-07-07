const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const message       = require(BASE_DIR +'/config/Messages.json');
const utils         = new (require(BASE_DIR +'/helpers/Utils'))();
const Portfolio     = new (require(BASE_DIR +'/models/Portfolio'))();

class PortfolioController {
    async getDataList(req, res) {
        let response = {...message.ERR_RESPONSE};
        let checkParam = await utils.requiredParams(req, ["offset", "limit"]);

        if(!checkParam) return res.send({...message.ERR_BAD_REQUEST}).status(400);

        let result = await Portfolio.getListData(req.query);

        response = (result.count) ? {...message.SUCCESS_RESPONSE} : {...message.SUCCESS_DATA_NOT_FOUND};
        response['content'] = (result) ? result : {};

        return res.send(response).status(200);
    }

    async getData(req, res) {
        let response = {...message.ERR_RESPONSE};
        let checkParam = await utils.requiredParams(req, ["PortfolioId"]);
        
        if(!checkParam) return res.send({...message.ERR_BAD_REQUEST}).status(400);

        let result = await Portfolio.getData(req.query);

        response = (result) ? {...message.SUCCESS_RESPONSE} : {...message.SUCCESS_DATA_NOT_FOUND};
        response['content'] = (result) ? result : {};

        return res.send(response).status(200);
    }

    async createPortfolio(req, res) {
        let response = {...message.ERR_RESPONSE};
        let checkParam = await utils.requiredParams(req, ["type", "source", "name", "url"]);
        if(!checkParam) return res.send({...message.ERR_BAD_REQUEST}).status(400);

        if(typeof req.body.source !== "object") return res.send({...message.ERR_BAD_REQUEST}).status(400);

        req.body.name = req.body.name.replaceAll(/<(.+?)>/g, '');

        let result = await Portfolio.insertData(req.body);

        if(result) {
            response = {...message.SUCCESS_RESPONSE};
            res.status(200);
        } else {
            res.status(400)
        }
        
        return res.send(response);
    }
}

module.exports = PortfolioController;