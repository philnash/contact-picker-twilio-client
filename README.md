# Contact Picker Twilio Client

This application is an example of the Contact Picker API for the web being used in conjuction with [Twilio Client](https://www.twilio.com/docs/voice/client/javascript) to make phone calls from the browser.

_Note:_ The Contact Picker API is currently only supported in Chrome 80 on Android M and later. To see this in action you will need to test with an Android device.

## Running this application

You will need a few things to run this application.

- [Node.js](https://nodejs.org/)
- A Twilio account (you can [sign up for a free Twilio account here](https://www.twilio.com/try-twilio))
- [A Twilio number](https://www.twilio.com/console/phone-numbers/) you can make calls from
- [ngrok](https://ngrok.com/) for [tunnelling webhooks through to your local development server in style](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html)

### Get the application

Clone the repo from GitHub:

```bash
git clone https://github.com/philnash/contact-picker-twilio-client.git
cd contact-picker-twilio-client
```

Install the dependencies:

```bash
npm install
```

Copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

Fill in the `.env` file with the following:

| Env variable         | Description                                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| TWILIO_ACCOUNT_SID   | Your Twilio Account SID from [the Twilio console](https://www.twilio.com/console/)                                                      |
| TWILIO_API_KEY       | API credentials for signing the access token, [create them in the console here](https://www.twilio.com/console/voice/settings/api-keys) |
| TWILIO_API_SECRET    | API credentials for signing the access token, [create them in the console here](https://www.twilio.com/console/voice/settings/api-keys) |
| TWILIO_TWIML_APP_SID | A [TwiML App SID](https://www.twilio.com/console/voice/twiml/apps), see below for how to configure your TwiML App                       |
| CALLER_ID            | [A Twilio number](https://www.twilio.com/console/phone-numbers/) you can make calls from                                                |

### Configuring your TwiML App

A [TwiML App](https://www.twilio.com/console/voice/twiml/apps) is a collection of webhook URLs. For this application we only need a voice request URL. Since we will be running this application locally and tunnelling through to it with [ngrok](https://ngrok.com) you should start up ngrok pointing to port 3000:

```bash
ngrok http 3000
```

Take note of the ngrok URL and enter it, with the path `/voice` as the voice request URL for a new TwiML app. The URL entirely should be:

```
https://YOUR_NGROK_SUBDOMAIN.ngrok.io/voice
```

Save the TwiML App and enter the SID in the `.env` file.

### Start the application

Run the application with:

```bash
npm start
```

And visit [localhost:3000](http://localhost:3000) to see the app in action.

## License

MIT © Phil Nash 2020
