const _ = require('lodash');
const User = require('../models/user');
const csv = require('csvtojson');
const { publishToQueue } = require('../workers/queueGenerator');
const { QUEUE_NAME } = process.env;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('csv_file');
const emailValidator = require("email-validator");
 


//==============> API Method for Creating a user <==============//
const create = async (req, res) => {
    try {
        // Validate the incoming request
        if (!req.body) {
            res.status(400).json({
                success: false,
                message: "Content can not be empty!"
            });
            return;
        }

        // Data Sanitization
        Object.keys(req.body).forEach(k => {
            req.body[k] = typeof req.body[k] === 'string' ? req.body[k].trim() : req.body[k];
        });

        const { firstName, lastName, age, email } = req.body;

        // Data Validation
        if (!firstName || !lastName || !age || !email) {
            res.status(400).json({
                success: false,
                message: "Please Must Provide, Required Fields!"
            });
            return;
        }

        // Data(Email) Validation
        if(!emailValidator.validate(email)) {
            res.status(400).json({
                success: false,
                message: "Invalid Email!"
            });
            return;
        }

        // Generating Data to Create an User 
        const user = {
            firstName,
            lastName,
            age,
            email
        };

        // Checking If the user Alreday exists with the same email Id
        const isUserExists = await User.findOne({ email: email }, { email: 1, _id: 0 })
        if (isUserExists && isUserExists.email) {
            return res.status(400).json({
                success: false,
                message: "Failed: User with same email address alreday Exists!",
                data: null,
            });
        }

        // Save User in the database
        User.create(user)
            .then((data) => {
                // Sending the Success Response
                res.status(201).json({
                    success: true,
                    message: 'User Created...',
                    data: data,
                });
            })
            .catch(err => {
                console.log('DB Error while Creating User : ', err);
                // Sending the Failed Response
                res.status(400).json({
                    success: false,
                    message: err.message || "DB error occurred while creating the user.",
                    data: null,
                });
            });
    } catch (error) {
        console.log('Error while Creating User : ', error);
        // Sending the Failed Response
        res.status(500).json({
            success: false,
            message: error.message || "Some error occurred while creating the user.",
            data: null,
        });
    }
};
//=========> API Method for Creating a user, Ends here <=========//



//==============> API Method for fetching all users <==============//
const getAll = (req, res) => {
    try {
        // Retrieving all the users from "users table"
        User.find({})
            .then(data => {
                // Sending the Success Response
                res.status(200).json({
                    success: true,
                    data: data,
                });
            })
            .catch(err => {
                console.log('DB Error while fetching Users : ', err);
                // Sending the Failed Response
                res.status(400).json({
                    success: false,
                    data: null,
                    error: err.message || "DB error occurred while fetching users.",
                });
            });
    } catch (error) {
        console.log('Error while fetching Users : ', error);
        // Sending the Failed Response
        res.status(500).json({
            success: false,
            data: null,
            error: error.message || "Some error occurred while fetching users.",
        });
    }
}
//=========> API Method for fetching all users, Ends here <=========//



//======> API Method for Sending Email to users(using Queue) <======//
const sendEmail = async (req, res) => {
    try {
        // Loading the CSV file
        upload(req, res, async function (err) {
            if (err) {
                return res.status(200).send({
                    message: 'Error in loading CSV file!',
                    error: err.message || err,
                });
            } else {
                if (req.file) {
                    // Reading the newsLetter(Data) from CSV file
                    const newsLetterData = await csv().fromString(req.file.buffer.toString('utf8'));
                    const csvEmails = newsLetterData.map((obj) => {
                        return obj.email;
                    });

                    // Getting the user Details from DB, for all the newsLetter required(matched) user
                    const matchedUsers = await User.find({ email: { $in: csvEmails } }, { firstName: 1, lastName: 1, email: 1, _id: 0 });

                    const newsLetterDataList = matchedUsers.map((user) => {
                        const obj = {};
                        newsLetterData.map((data) => {
                            if (data.email == user.email) {
                                // Generating the required data(JSON) for sending the data into the Queue(for email sending)
                                obj.title = data.title,
                                    obj.content = data.content,
                                    obj.toName = `${user.firstName || 'Mr.'} ${user.lastName || 'Anonymous'}`,
                                    obj.toEmail = user.email
                            }
                        });
                        return obj;
                    });

                    // Sending the newsLetter data to queue(for being consumed later)
                    for await (const newsLetterData of newsLetterDataList) {
                        publishToQueue(QUEUE_NAME, JSON.stringify(newsLetterData));
                    }

                    // Sending the Suceess Response
                    res.status(200).json({
                        success: true,
                        message: "Email Sent to User(s) Successfully...",
                    });
                }
            }
        });
    } catch (error) {
        console.log('Error while sending email to Users : ', error);
        // Sending the Failed Response
        res.status(500).json({
            success: false,
            message: error.message || "Some error occurred while sending email the users.",
        });
    }
};
//===> API Method for Sending Email to users(using Queue), Ends here <===//




module.exports = {
    create,
    getAll,
    sendEmail
}