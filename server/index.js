const path = require("path");
const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("pino")();
const pino = require("express-pino-logger")({
  logger: logger
});
const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const app = express();

app.use(pino);
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "..", "client")));

app.post("/token", (req, res) => {
  const identity = req.body.identity || config.defaultIdentity;
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: config.twilio.twimlAppSid
  });
  const token = new AccessToken(
    config.twilio.accountSid,
    config.twilio.apiKey,
    config.twilio.apiSecret,
    { identity: identity }
  );
  token.addGrant(voiceGrant);
  res.json({ token: token.toJwt() });
});

app.post("/voice", (req, res) => {
  const twimlResponse = new VoiceResponse();
  twimlResponse.dial({ callerId: config.twilio.callerId }).number(req.body.To);
  res.set("Content-Type", "text/xml");
  res.send(twimlResponse.toString());
});

app.listen(config.port, () => {
  logger.info(`App started on http://localhost:${config.port}`);
});
