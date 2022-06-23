require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

// Security for API
app.use(helmet());

// cors error handling
app.use(cors());

// MongoDB
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

if (process.env.NODE_ENV !== "production") {
    const mDb = mongoose.connection;
    mDb.on("open", () => {
    console.log("MongoDB is connected");
  });

  mDb.on("error", (error) => {
    console.log(error);
  });

  // Logging
  app.use(morgan());
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load routers
const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");

// Use routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

app.use("*", (req, res) => {
  res.json({ message: "Router could not find any resources :(" });
});

app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`);
});
