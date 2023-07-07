const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const express       = require('express');
const session       = require('express-session');
const http          = require('http');
const https         = require('https');
const bodyParser    = require('body-parser');
const app           = express();
const message       = require(BASE_DIR + '/config/Messages.json');
const routes        = require(BASE_DIR + '/config/Routes');
const mongo         = new (require(BASE_DIR + '/helpers/MongoDriver'))();

require('dotenv').config();

app.use(session({
    secret: process.env.APP_SECRET,
    saveUninitialized: true,
    resave: false
}));

app.use(bodyParser.json({
    extended: false,
    limit: '50mb'
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(BASE_DIR + "/public"));
app.use("/api", routes);

const server = http.createServer(app);

const connectDb = async () => {
    const connectToDB = await mongo.createConnection(process.env.APP_DATABASE_HOST, process.env.APP_DATABASE_NAME);
    if(connectToDB) {
        server.listen(process.env.APP_PORT, () => {
            console.log(process.env.APP_NAME +' is listening at port '+ process.env.APP_PORT);
        });
    }
}

connectDb();