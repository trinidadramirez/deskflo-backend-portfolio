const express = require("express");
const router = express.Router();
const { insertNewTicket } = require("../model/ticket/ticketModel");

router.all("/", (req, res, next) => {
  //res.json({ message: "Return from ticket router" });
  next();
});

router.post("/", async (req, res) => {
  try {
    // Get new ticket submission
    const { requestor, shortDescription, description, message } = req.body;

    // Insert new ticket submission in db
    const ticketObj = {
      requestorId: "62b501a9ff320fe6dbdaa6bb",
      requestor,
      shortDescription,
      description,
      chat: [
        {
          requestor,
          message,
        },
      ],
    };
    const result = await insertNewTicket(ticketObj);
    console.log(result);
    if (result._id) {
      return res.json({
        status: "success",
        message: "new ticket has been created",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

module.exports = router;
