require("dotenv").config();
const express = require("express");
const app = express();
const mongoConnect = require("./config/databaseConfig");
const passport = require("passport");
const logger = require("morgan");
const cors = require("cors");
const hbs = require("express-hbs");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("./config/passportLocalConfig");

const menteesRoutes = require("./routes/mentees");
const mentorRoutes = require("./routes/mentors");
const moderatorRoutes = require("./routes/moderators");
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "hbs");

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes Mounting
app.use("/api/mentees", menteesRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/moderator", moderatorRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, () => {
  console.log(`App running on Port: ${process.env.PORT}`);
});
