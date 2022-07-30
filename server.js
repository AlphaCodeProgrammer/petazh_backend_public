const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");

const barberRoutes = require("./routes/barber");
const userRoutes = require("./routes/user");
const turnRoutes = require("./routes/turn")
const modelRoutes = require("./routes/model")
const productRoutes = require("./routes/product")


dotenv.config();

const app = express();
app.use(cors());

app.use(passport.initialize());
require("./config/passport")(passport);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      
    } else {
      console.log("Connected to The Database");
    }
  }
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080", "http://localhost:34903/"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/users", userRoutes);
app.use(barberRoutes);
app.use(turnRoutes);
app.use("/models", modelRoutes);
app.use("/products", productRoutes);



app.listen(3002, (_) => {

  console.log("The Server is lesening to Port", 3002);

});
