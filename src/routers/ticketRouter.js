const express = require("express");
const router = express.Router();
const {
  insertNewTicket,
  getTickets,
  getTicketsById,
  putReply,
  resolveTicket,
  cancelTicket,
  reopenTicket,
  changePriorityOnTicket,
} = require("../model/ticket/ticketModel");
const { userAuthorization } = require("../auth/authorization");

router.all("/", (req, res, next) => {
  next();
});

// Create ticket (router)
router.post("/", userAuthorization, async (req, res) => {
  try {
    // Get new ticket submission
    const { requestor, priority, shortDescription, description, sender, message } = req.body;
    const userId = req.userId;

    // Insert new ticket submission in db
    const ticketObj = {
      requestorId: userId,
      priority,
      requestor,
      shortDescription,
      description,
      chat: [
        {
          sender,
          message,
        },
      ],
    };
    const result = await insertNewTicket(ticketObj);
    if (result._id) {
      return res.json({
        status: "success",
        message: "New Ticket Has Been Created!",
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
    const result = await getTicketsById(_id);
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
        message: "Message Sent Successfully",
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
    const result = await resolveTicket({ _id });

    if (result._id) {
      return res.json({
        status: "success",
        message: "Ticket Resolved Successfully",
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
    const result = await cancelTicket({ _id });

    if (result._id) {
      return res.json({
        status: "success",
        message: "Ticket Canceled Successfully",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Reopen ticket
router.patch("/reopen-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await reopenTicket({ _id });

    if (result._id) {
      return res.json({
        status: "success",
        message: "Ticket Reopened Successfully",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Change ticket priority
router.patch("/change-priority/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const { priority } = req.body;
    console.log("---------->>>>>>> " + priority);
    const result = await changePriorityOnTicket({ _id, priority });

    if (result._id) {
      return res.json({
        status: "success",
        message: "Ticket Priority Changed Successfully",
      });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

module.exports = router;
