const express = require('express');
const userRouter = express.Router();
const user = require('../controllers/user')


//===========> user Routes <===========//


// Route for Creating a Post
userRouter.post('/', user.create);

// Route for retrieving all the users
userRouter.get('/', user.getAll);

// Route for Sending Email to the users
userRouter.post('/send-email', user.sendEmail);

//===========> Posts Routes ends here <===========//

module.exports = userRouter;
