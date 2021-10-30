const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("../src/auth_config.json");
const db = require("../models");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

module.exports = (app) => {
  // test external API connection with auth0 bearer token
  app.get("/api/external", checkJwt, (req, res) => {
    res.send({
      msg: "Your access token was successfully validated!",
    });
  });

  // create a new car for a user
  app.post("/api/new/car", checkJwt, async (req, res) => {
    try {
      await db.Car.create({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        userid: req.user.sub,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
    res.status(201).end();
  });

  // TODO route to log a fillup for a user's car
};
