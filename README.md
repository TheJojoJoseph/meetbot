# Meetbot 

Meetbot will listen to google meet urls to join to and perform various tasks.

By default since the bot isn't authenticated it will prompt people in the meet to allow the bot to join.

![](img/diagram.drawio.png)

## Development

After cloning the repository, install the dependencies:

```
npm ci
```

## Running the bot 

```
npm start
```

The bot will now be running but functionality is limited until you add additional configurations for [authentication](#authentication).

To get a bot to join a Google Meet, send a POST request to the join endpoint with the meet url as mentioned below:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://meet.google.com/wtq-bhai-amg"}' \
  http://localhost:8080/api/join
```
## UI Development
To develop the UI, `cd` into `/src/ui` and run `yarn/npm run dev`. This will spin up the development server. You should then be able to access the dashboard at `http://localhost:3000/ui`. Note that the data you will see on the tables are actually being mocked by MirageJS, and not actual request is going to the API. This makes it easier to develop both components in an entirely decoupled way.

A meetbot should request to join the Google Meet.

## Authentication

Copy `.env.example` to `.env` and populate it with the correct information. This is used by the bot to login to accounts.google.com.

Finally, for integrations with Google docs and calendar you must download the credentials file containing data for oauth2 flow. This is used to authenticate requests to the Google API. See the following docs to create the credentials needed:

- Step 1: https://developers.google.com/workspace/guides/create-project
- Step 2: https://developers.google.com/workspace/guides/create-credentials#desktop
- Step 3: At the end of the process, download the JSON file and place it at the root of the project directory with name as "credentials.json".

Troubleshooting: https://stackoverflow.com/questions/58460476/where-to-find-credentials-json-for-google-api-client

After following the steps, run the command below and follow the instructions to generate a `token.json` file. This authentication process is one time only and after this the token.json file will be used for any further authentication process. 

```
ts-node src/google/create-token.ts
```

## Deployment

Before deployment, create an `.env` file using the fields mentioned below:

```
GOOGLE_PASSWORD=              # Password for your bot/user that is used to join Google Meet. 
GOOGLE_TOTP_SECRET=           # [Optional] If the bot account has 2FA auth, then add 2FA secret here.
GOOGLE_LOGIN=                 # Email-ID/username of your bot/user
TOKEN_PATH=token.json         # [Default] Path to token file 
HTTP_PORT=80                  # Port to run express server on. For prod, use port 80.
RUNNING_ALPINE=0              # [Default] If base image is alpine then set the env var, otherwise don't. 
```

Run the command below and follow the instructions to generate a `token.json` file. This authentication process is one time only.

```
ts-node src/google/create-token.ts
```

To deploy, use the dockerfiles present in the repository. Tweak the base image and other details as per your deployment platform (AWS, Heroku etc.) and deploy. 
To deploy on balenaCloud, run the command below:

```
balena push <Name of fleet>
```
