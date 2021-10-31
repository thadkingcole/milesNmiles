const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("../src/auth_config.json");
const { Car, Trip } = require("../models");

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
  app.post("/api/car", checkJwt, async (req, res) => {
    try {
      await Car.create({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        userId: req.user.sub,
        startDate: req.body.startDate,
        startOdo: req.body.startOdo,
      });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(201).end();
  });

  // create a trip for a user's car
  app.post("/api/trip", checkJwt, async (req, res) => {
    // validate user has access to car
    try {
      // get car being requested for adding trip
      const tripCar = await Car.findByPk(req.body.CarId);
      tripCar || res.status(404).end(); // car not found
      // car does not belong to user - forbidden
      tripCar.dataValues.userId !== req.user.sub && res.status(403).end();
    } catch (err) {
      res.status(500).json(err);
    }

    // create the trip
    try {
      await Trip.create({
        fillDay: req.body.fillDay,
        odoMiles: req.body.odoMiles,
        gallons: req.body.gallons,
        CarId: req.body.CarId,
      });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(201).end();
  });

  // get all a user's cars/trips
  app.get("/api/cars/trips", checkJwt, async (req, res) => {
    let cars; // all cars that belong to the user
    try {
      cars = await Car.findAll({ where: { userId: req.user.sub } });
    } catch (err) {
      res.status(500).json(err);
    }
    const carIds = cars.map((car) => car.dataValues.id);
    let trips; // all trips that belong to the user's cars
    try {
      trips = await Trip.findAll({ where: { CarId: carIds } });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).json(trips);
  });
};
