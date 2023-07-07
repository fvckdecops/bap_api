const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const message       = require(BASE_DIR +'/config/Messages.json');
const utils         = new (require(BASE_DIR +'/helpers/Utils'))();
const Mail          = new (require(BASE_DIR +'/models/Mail'))();
const sMail         = require('@sendgrid/mail');

class BioController {
    async sendMail(req, res) {
        let response = {...message.ERR_RESPONSE};
        let checkParam = await utils.requiredParams(req, ["name", "description", "subject", "email"]);
        if(!checkParam) return res.send({...message.ERR_BAD_REQUEST}).status(400);
        
        sMail.setApiKey(process.env.EMAIL_API_KEY);

        req.body.name = req.body.name.replaceAll(/<(.+?)>/g, '');

        let result = await Mail.insertData(req.body);

        if(result) {
            const {name, description, subject, email} = req.body;
            const msg = {
                to: 'bagas@adjipratama.web.id',
                from: email,
                subject: name +' :'+ subject,
                text: email +' '+ description
            }

            try {
                await sMail.send(msg);

                response = {...message.SUCCESS_RESPONSE};
                response['message'] = "Email sent.";
            } catch (err) {
                res.status(400);
            }

        } else {
            res.status(400);
        }
        
        return res.send(response);
    }
}

module.exports = BioController;