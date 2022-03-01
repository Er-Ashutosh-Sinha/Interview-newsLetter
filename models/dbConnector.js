const mongoose = require('mongoose');
const { DB_NAME } = process.env;

//Set up default mongoose connection
const mongoDB_URL = `mongodb://127.0.0.1/${DB_NAME}`;
mongoose.connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.once('open', () => console.log(`MongoDB connected...`));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));