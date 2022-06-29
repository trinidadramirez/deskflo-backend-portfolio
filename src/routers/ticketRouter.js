const express = require("express");
const router = express.Router();
const {
  insertNewTicket,
  getTickets,
  getTicketsById,
  putReply,
  resolveTicket,
  cancelTicket,
} = require("../model/ticket/ticketModel");
const { userAuthorization } = require("../auth/authorization");

router.all("/", (req, res, next) => {
  //res.json({ message: "Return from ticket router" });
  next();
});

// Create ticket (router)
router.post("/", userAuthorization, async (req, res) => {
  try {
    // Get new ticket submission
    const { requestor, shortDescription, description, message } = req.body;
    const userId = req.userId;

    // Insert new ticket submission in db
    const ticketObj = {
      requestorId: userId,
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

// Get all tickets by user (router)
router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getTickets(userId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Get specific ticket (router)
router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const requestorId = req.userId;
    const result = await getTicketsById(_id, requestorId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Put updated messages in ticket
router.put("/:_id", userAuthorization, async (req, res) => {
  try {
    const { message, sender } = req.body;
    const { _id } = req.params;
    const requestorId = req.userId;
    const result = await putReply({ _id, message, sender });

    if (result._id) {
      return res.json({
        status: "success",
        message: "message updated",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Resolve ticket
router.patch("/resolve-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const requestorId = req.userId;
    const result = await resolveTicket({ _id, requestorId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "ticket resolved!",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Cancel ticket
router.patch("/cancel-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const requestorId = req.userId;
    const result = await cancelTicket({ _id, requestorId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "ticket canceled!",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

module.exports = router;
