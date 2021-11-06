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

async function validateCarAccess(req, res) {
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
}

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
    await validateCarAccess(req, res);
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

  // TODO create a batch of trips from a csv file

  // get all a user's cars/trips
  app.get("/api/cars/trips", checkJwt, async (req, res) => {
    const data = {};
    try {
      data.cars = await Car.findAll({ where: { userId: req.user.sub } });
    } catch (err) {
      res.status(500).json(err);
    }
    const carIds = data.cars.map((car) => car.dataValues.id);
    try {
      data.trips = await Trip.findAll({ where: { CarId: carIds } });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).json(data);
  });

  // update user's car info
  app.put("api/car", checkJwt, async (req, res) => {
    await validateCarAccess(req, res);
    // update car info
    try {
      // req.body should have all fields requiring update
      await Car.update(req.body, { where: { id: req.body.CarId } });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).end();
  });

  // update a trip
  app.put("api/trip", checkJwt, async (req, res) => {
    await validateCarAccess(req, res);
    //update trip info
    try {
      //req.body should have all fields requiring update
      await Trip.update(req.body, { where: { id: req.body.tripId } });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).end();
  });

  // delete a car
  app.delete("api/car", checkJwt, async (req, res) => {
    await validateCarAccess(req, res);
    // delete car
    try {
      await Car.destroy({ where: { id: req.body.CarId } });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).end();
  });

  // delete a trip
  app.delete("api/trip", checkJwt, async (req, res) => {
    await validateCarAccess(req, res);
    // delete trip
    try {
      await Trip.destroy({ where: { id: req.body.tripId } });
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).end();
  });
};
