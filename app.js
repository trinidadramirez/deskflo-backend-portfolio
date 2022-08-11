require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;
// const io = require("socket.io")(3003, {
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:3002"]
//   }
// })

// io.on("connection", socket => {
//   console.log(socket.id);
//   socket.on("send-msg", (obj) => {
//     io.emit("receive-msg", obj)
//     console.log(obj)
//   })
// })

// Load routers
const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");
const tokenRouter = require("./src/routers/tokenRouter");

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

// Use routers
app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/token", tokenRouter);

app.use("*", (req, res) => {
  res.json({ message: "Router could not find any resources :(" });
});

app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`);
});
