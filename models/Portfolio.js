const path          = require('path');
const moment        = require('moment');
const fs            = require('fs').promises;
const randomstring  = require('randomstring');
const BASE_DIR      = path.dirname(require.main.filename);
const mongo         = new (require(BASE_DIR +'/helpers/MongoDriver'))();

class PortfolioModels {
    async getListData(body) {
        let filter = {};
        let agg = [];

        if("search" in body && body.search) filter['portfolioName'] = { $regex: new RegExp('.*' + body.search + '.*', 'i') };

        agg.push({"$match": filter});

        let count = await mongo.getAggregateData(process.env.APP_DATABASE_NAME, "portfolio", agg);

        count = count.length

        if("offset" in body && body.offset) agg.push({"$skip": parseInt(body.offset)});
        if("limit" in body && body.limit) agg.push({"$limit": parseInt(body.limit)});

        if("sort" in body && body.sort) agg.push({"$sort": body.sort});

        let results = await mongo.getAggregateData(process.env.APP_DATABASE_NAME, "portfolio", agg);
        
        return (count && results) ? {count, results} : {"count": 0, "results": []};
    }

    async getData(body) {
        let clause = {"_id": body.portfolioId}
        let result = await mongo.searchData(process.env.APP_DATABASE_NAME, "portfolio", clause);
        
        return (result.length) ? result[0] : false;
    }

    async insertData(body) {
        let dateCreate = moment().toDate();
        let ext = '';
        let path = BASE_DIR +'/public/images/portfolio/';

        switch(body.source.mimeType) {
            case "image/png":
                ext = ".png";
                break;
            case "image/webp":
                ext = ".webp";
                break;
            default:
                ext = ".jpeg"
        }

        let fileName = body.source.fileName.split('.')[0] + ext;

        try {
            await fs.access(path);
            await fs.writeFile(path + fileName, body.source.data, 'base64');
        } catch(err) {
            await fs.mkdir(path, { recursive: true });
            await fs.writeFile(path + fileName, body.source.data, 'base64');
        }

        body = {"_id": randomstring.generate(), ...body, "source": fileName, dateCreate, dateUpdate: null};
        let result = await mongo.insertData(process.env.APP_DATABASE_NAME, "portfolio", body);

        return (result) ? true : false;
    }
}

module.exports = PortfolioModels;