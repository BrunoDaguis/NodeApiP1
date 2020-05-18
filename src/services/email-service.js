'use strict';
const config = require('../config');
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(config.sendgridKey);


exports.send = async (to, subject, body) => {
    const msg = {
        to: to,
        from: 'bruno.daguis@hotmail.com',
        subject: subject,
        html: body,
    };

    try {
        await sendgrid.send(msg);
    } catch (error) {

        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}