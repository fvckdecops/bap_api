const path          = require('path');
const moment        = require('moment');
const fs            = require('fs').promises;
const randomstring  = require('randomstring');
const BASE_DIR      = path.dirname(require.main.filename);
const mongo         = new (require(BASE_DIR +'/helpers/MongoDriver'))();

class ServiceModels {
    async getListData(body) {
        let filter = {};
        let agg = [];

        if("search" in body && body.search) filter['serviceName'] = { $regex: new RegExp('.*' + body.search + '.*', 'i') };

        agg.push({"$match": filter});

        let count = await mongo.getAggregateData(process.env.APP_DATABASE_NAME, "service", agg);

        count = count.length

        if("offset" in body && body.offset) agg.push({"$skip": parseInt(body.offset)});
        if("limit" in body && body.limit) agg.push({"$limit": parseInt(body.limit)});

        if("sort" in body && body.sort) agg.push({"$sort": body.sort});

        let results = await mongo.getAggregateData(process.env.APP_DATABASE_NAME, "service", agg);
        
        return (count && results) ? {count, results} : {"count": 0, "results": []};
    }

    async getData(body) {
        let clause = {"_id": body.serviceId}
        let result = await mongo.searchData(process.env.APP_DATABASE_NAME, "service", clause);
        
        return (result.length) ? result[0] : false;
    }

    async insertData(body) {
        let dateCreate = moment().toDate();

        body = {"_id": randomstring.generate(), ...body, dateCreate, dateUpdate: null};
        let result = await mongo.insertData(process.env.APP_DATABASE_NAME, "service", body);

        return (result) ? true : false;
    }
}

module.exports = ServiceModels;