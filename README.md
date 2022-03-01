# Newsletter

> Description

This is the app to Create User(with details like first-name, last-name, email & age).
And Then it(app) is used to send the emails to the users by fetching newsletters from a specific CSV file.

### APIs


> Create User
```bash
http://localhost:3000/user
```
```Method: Post```

```sample Request Body: {"firstName": "Ashutosh","lastName": "Sinha","age": 27, "email": "ashutosh.75way@gmail.com"}```

> Send Email(Newsletter)
```bash
http://localhost:3000/send-email
```
```Method: Post```

```sample Request Body should have a csv file(with key name 'csv_file') and the request body should be in formdata ```


<br>
<br>


## To Run this App, Do the following Steps

### 1. Environment variables Updation
> Update the following keys in .env file

```Put the correct existing DB name, or create a new DB and then put name in .env(DB_NAME). Update the QUEUE_NAME(name of the rabbit MQ's queue). Also env variable "MAILER_PWD" is the google application password, and not the gmail password. ```

```bash
PORT=
DB_NAME=
MAILER_USER=
MAILER_PWD=
QUEUE_NAME=
```

### 2. Installation of project dependencies
> Run the following command

```bash
npm install
```

### 3. Starting the project
> Run the following command

```bash
npm start
```

### 4. Testing the App(through Postman)

> Import the Postman collection(News-Letter.postman_collection) given in root Directory of the app.

NOTE : Use actual credentials/emails for appropriate result.

