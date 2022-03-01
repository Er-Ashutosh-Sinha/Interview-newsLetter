"use strict";
const nodemailer = require("nodemailer");
const _ = require('lodash');
const { MAILER_USER, MAILER_PWD } = process.env;

const mailer = async (newsLetter) => {
    try {
        const { title, content, toName, toEmail } = newsLetter;
        const emailSubject = title ? `${title}` : `NewsLetter`;
        const emailConetent = content ? `${content}` : `...`;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAILER_USER,
                pass: MAILER_PWD
            }
        });

        // Sending mail with transport object and other required fields
        await transporter.sendMail({
            to: toEmail, // receiver of email
            subject: `${emailSubject}`, // Subject line
            html: `<p> Hi, <i>${toName}</i> <br> ${emailConetent}. <br><br> Thanks. </p>` // html body
        });

    } catch (error) {
        console.log('Error while sending Email : ', error);
    }
}

module.exports = {
    mailer
}