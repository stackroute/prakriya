const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const smtpTransport = require('nodemailer-smtp-transport');
const logger = require('./../../applogger');
const CONFIG = require('../../config');

const transporter = nodemailer.createTransport(smtpTransport({
    service: CONFIG.EMAIL.SERVICE_PROVIDER,
    auth: {
        user: CONFIG.EMAIL.USERNAME,
        pass: CONFIG.EMAIL.PASSWORD
    }
}));

let sendEmail = function (emailObj) {
    logger.debug('Reached to mail server', emailObj);
    try {
        // ----------verify------------------
        const mail = {
            from: CONFIG.EMAIL.USERNAME,
            to: emailObj.email,
            subject: emailObj.subject,
            html:
                `<div>
                    <h2>Prakriya</h2>
                    <p><em>` +
                        emailObj.content
                    + `</em></p>
                    <h4>Thank You!</h4>
                    <strong>Note: </strong>
                    This is an automated mail. Do not reply to this mail.
                </div>`
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mail, function (err, response) {
                if (err) {
                    logger.error('response not found', err);
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        response: response,
                        msg: 'Mail sent successfully to ' + emailObj.email
                    });
                }
            });
        });
    } catch (error) {
        logger.fatal('Exception occured' + error);
        return error;
    }
};

module.exports = {
    sendEmail: sendEmail
};
