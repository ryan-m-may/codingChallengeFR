# codingChallengeFR

This is a back-end project using Node with Express. There are 3 routes, `/login`, `/upload`, and `/identites`. I used `local` and `jwt` PassportJS strategies to protect the routes, and Jest and Postman for testing the endpoints.

# Table of Contents

## [Technologies](https://github.com/ryan-m-may/codingChallengeFR#technologies-1)
## [Installation Instructions](https://github.com/ryan-m-may/codingChallengeFR#installation-instructions-1)
## [Getting Started](https://github.com/ryan-m-may/codingChallengeFR#getting-started-1)
* ### [MongoDB](https://github.com/ryan-m-may/codingChallengeFR#mongodb-1)
* ### [Google Credentials](https://github.com/ryan-m-may/codingChallengeFR#google-credentials-1)
* ### [Postman](https://github.com/ryan-m-may/codingChallengeFR#postman-1)

## Technologies:
NodeJS / ExpressJS

MongoDB

Passport / jsonwebtoken
* Local Strategy and JWT Strategy
* Route AuthN/AuthZ
* bcryptjs used for hashing passwords

Jest & Supertest
* Testing Endpoints

dotenv
* Storing secrets like JWT Secret and Google Cloud secrets

Multer
* Middleware for express to handle file uploads

fast-csv
* Parsing CSV files

ESLint
* Enforcing clean code
* Conforming to readable style

# Installation Instructions

The following instructions outline the steps taken to install MongoDB in this [official documentation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).

---
1. Install the Xcode command-line tools by running the following command in your macOS Terminal:

    `xcode-select --install`

2. Install Homebrew using these [official instructions](https://brew.sh/#install).


    * Install the MongoDB Homebrew Tap:

      `brew tap mongodb/brew`

    * Install MongoDB:

      `brew install mongodb-community`


> I have these versions of Mongo and Node installed locally:
>
> * MongoDB Community Edition v5.0.2
>
> * Node v14.16.0 LTS

# Getting Started

* MongoDB
* Google Credentials

## MongoDB

To run MongoDB as a macOS service, run:

`brew services start mongodb-community`

To stop MongoDB macOS service, run:

`brew services stop mongodb-community`

To verify MongoDB is running, run:

`brew services list`

> You should see the service `mongodb-community` listed as `started`.

To start Mongo, run:

`mongosh`

Create a database:

`use employeeDB`

Create a collection:

`db.createCollection('employees')`

Index the collection:

`db.employees.createIndex({USR_ID: 1}, {unique: true})`

> NOTE: If you use `show dbs` at this point, `employeeDB` won't show up. That's because there's nothing in it right now.

Create a user `mongosh [database name] [filepath]`
> EXAMPLE: In my case, the command is: `mongosh employeeDB /Users/ryanmay/Desktop/codingChallengeFR/server/DBTemplates/createUser.js`

## Google Credentials

The steps I will be highlighting follow the procudere from these official [google docs](https://developers.google.com/identity/protocols/oauth2)
1. Create a `config.env` file based on the `config.env.example` that I have provided.
    * Use the [dotenv](https://www.npmjs.com/package/dotenv) module for reference
    * You can just delete `.example` from the name of the `config.env.example` and it will work.
2. Obtain OAuth 2.0 credentials from the [Google API Console](https://console.developers.google.com/).
    * Create new project from the dropdown menu at the top of the page.
    * Go to `APIs & Services` dashboard from the left menu.
    * Click `+ Enable APIs & Services`.
    * Scroll down to `Google+ API`.
    * Click `ENABLE`.
    * Go back to `APIs & Services`.
    * Click `Credentials` from the left menu.
    * Click `+ Create Credentials` near the top of the screen and select `OAuth client ID`.
    * Select `web application` from the dropdown menu.
    * Under `Authorized redirect URIs` add `http://localhost:3000/login/google/callback`
      > This redirect URI will only work in development. This is fine for the purpose of this project, but if deploying this will need to be updated.
    * Click `Create` and make sure to save the `Client ID` and `Client Secret` before closing the window.
3. Add your Google credentials to the `config.env` file.
    * You'll need the `Client ID` and `Client Secret` obtained from the Google Cloud Console in step 2.

## Postman
1.  To use this app with postman, you'll first have to use the `/register` route. This will create a user in the database that can be used for authentication.
    * Make sure MongoDB is running before starting these steps.
    * To use this route just use Postman to make a POST request to `http://localhost:3000/register`.
2. Now that a user is established, make a POST request to `/login' using this JSON in the body:

```
{
    "email": "test@example.com",
    "password": "password"
}
```

> The response is a JWT. Make sure to store this, it will be necessary for the `/upload` and `/identites` endponts.

3. Under the `Auth` tab in Postman, select `Bearer Token` and place the JSON Web Token from step 2 in the token form.
4. Make a POST request to `/upload` with the Bearer Token set. In the `body` section, select the `form-data` radio button. Add the key `csv` and click upload and select the `sample.csv` file that came with this repository.
    * This will upload the values from the CSV file into MongoDB
5. Make a GET request to `/identites` with the Bearer Token set.

