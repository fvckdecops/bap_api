const express       = require('express');
const routes        = express.Router();
const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const message       = require(BASE_DIR +'/config/Messages.json');

const basicAuthMiddleware = async (req, res, next) => {
    let response = {...message.ERR_FORBIDDEN};
    let basicAuth = req.headers["authorization"].split(' ')[1];

    if (basicAuth) {
        basicAuth = Buffer.from(basicAuth, 'base64').toString("utf8").split(':');

        if(basicAuth[0] === process.env.API_USERNAME && basicAuth[1] === process.env.API_PASSWORD) {
            next();
        } else {
            return res.status(400).send(response);
        }
    }
};

const Bio       = new (require(BASE_DIR +'/controllers/Bio'))();
const Service   = new (require(BASE_DIR +'/controllers/Services'))();
const Portfolio = new (require(BASE_DIR +'/controllers/Portfolios'))();
const Mail      = new (require(BASE_DIR +'/controllers/Mail'))();

//Portfolio API

routes.get('/Portfolio/list', async (req, res) => Portfolio.getDataList(req, res));
routes.get('/Portfolio/detail', async (req, res) => Portfolio.getData(req, res));
routes.post('/Portfolio/new', async (req, res) => Portfolio.createPortfolio(req, res));

//Service API

routes.get('/Service/list', async (req, res) => Service.getDataList(req, res));
routes.get('/Service/detail', async (req, res) => Service.getData(req, res));
routes.post('/Service/new', async (req, res) => Service.createService(req, res));

//Bio API

routes.post('/Bio/new', async (req, res) => Bio.createBio(req, res));
routes.get('/Bio/detail', async (req, res) => Bio.getData(req, res));

//Mail API

routes.post('/Mail/send', basicAuthMiddleware, async (req, res) => Mail.sendMail(req, res));

module.exports = routes;