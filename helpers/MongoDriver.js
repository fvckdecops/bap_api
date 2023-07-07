const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const MongoClient   = require('mongodb').MongoClient;

global.DBConnection = {};

class MongoDriver {
    
    async createConnection(DB_CONN, DB_NAME) {
        try {
            const client = new MongoClient(DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            global.DBConnection[DB_NAME] = client.db(DB_NAME);
            return global.DBConnection[DB_NAME];
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async getCollections(db) {
        try {
            return await global.DBConnection[db].listCollections().toArray();
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async getAggregateData(db, collectionName, aggData) {
        try {
            let opt = { "cursor": {}, "allowDiskUse": true, "explain": false };
            return await global.DBConnection[db].collection(collectionName).aggregate(aggData, opt).toArray();
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async insertData(db, collectionName, doc) {
        try {
            let query = await global.DBConnection[db].collection(collectionName).insertOne(doc);
            return query.insertedId;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async insertManyData(db, collectionName, docs) {
        try {
            let query = await global.DBConnection[db].collection(collectionName).insertMany(docs);
            return query.insertedCount;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async updateData(db, collectionName, clause, doc) {
        try {
            let query = await global.DBConnection[db].collection(collectionName).updateOne(clause, { '$set': doc });
            return query.modifiedCount;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async updateManyData(db, collectionName, clause, doc) {
        try {
            let query = await global.DBConnection[db].collection(collectionName).updateMany(clause, { '$set': doc });
            return query.modifiedCount;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async upsertData(db, collectionName, clause, doc) {
        try {
            let query = await global.DBConnection[db].collection(collectionName).updateOne(clause, { '$set': doc }, { upsert: true });
            return query.modifiedCount;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async deleteManyData(db, collectionName, clause) {
        try {
            let query = await global.DBConnection[db].collection(collectionName).deleteMany(clause);
            return query.deletedCount;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async countData(db, collectionName, filter) {
        try {
            return await global.DBConnection[db].collection(collectionName).countDocuments(filter);
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async searchData(db, collectionName, filter) {
        try {
            return await global.DBConnection[db].collection(collectionName).find(filter).toArray();
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async searchDataOffsetLimit(db, collectionName, filter, offset, limit) {
        try {
            return await global.DBConnection[db].collection(collectionName).find(filter).limit(limit).skip(offset).toArray();
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async searchDataSortOffsetLimit(db, collectionName, filter, sort, offset, limit) {
        try {
            return await global.DBConnection[db].collection(collectionName).find(filter).sort(sort).limit(limit).skip(offset).toArray();
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async searchDataProjectOffsetLimit(db, collectionName, filter, project, offset, limit) {
        try {
            return await global.DBConnection[db].collection(collectionName).find(filter).project(project).limit(limit).skip(offset).toArray();
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

}

module.exports = MongoDriver;