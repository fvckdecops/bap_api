const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);

class Utils {
    async requiredParams(req, required) {
        let bodyReq = (req.method === "GET") ? req.query : req.body;
        let result = [];

        required.map((value) => { if(value in bodyReq) result.push(true) });

        return (result.length === required.length) ? true : false;
    }
}

module.exports = Utils;