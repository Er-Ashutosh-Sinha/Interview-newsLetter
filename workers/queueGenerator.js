require('./queueProcessor');
const amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://admin:password@localhost:5672/';
let ch = null;

// Connecting to queue Api and Creating the Channel
amqp.connect(CONN_URL, function (err, conn) {
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});

// Creating the method to send the Data to the queue
module.exports.publishToQueue = async (queueName, data) => {
   ch.sendToQueue(queueName, Buffer.from(data));
}


// Closing the channel on existing of process
process.on('exit', () => {
   ch.close();
   console.log(`Closing rabbitmq channel`);
});
