
const amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://admin:password@localhost:5672/';
const { mailer } = require('../workers/mailer');
const { QUEUE_NAME } = process.env;

// Connecting to MQ Queue
amqp.connect(CONN_URL, function (err, conn) {

    // Creating the Channel for using the Queue
    conn.createChannel(function (err, ch) {

        // Consuming the Queue's Data
        ch.consume(QUEUE_NAME, async function (msg) {

            // Sending the Email for each Data/User
            await mailer(JSON.parse(msg.content.toString()));

        }, { noAck: true }
        );
    });
});
