const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const authConfig = require("./src/auth_config.json");
const db = require("./models");

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes/api-routes.js")(app);

db.sequelize
  .sync({ force: true })
  .then(
    app.listen(port, () => console.log(`API Server listening on port ${port}`))
  )
  .catch((err) => {
    // common cause: MySQL server is not running
    console.error(err.message, "\n\n\t...Is your MySQL server running?\n");
    throw err;
  });
