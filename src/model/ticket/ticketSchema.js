const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TicketSchema = new Schema({
  requestorId: {
    type: Schema.Types.ObjectId
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  status: {
    type: String,
    maxLength: 20,
    required: true,
    default: "Open",
  },
  requestor: {
    type: String,
    maxLength: 100,
    required: true,
  },
  shortDescription: {
    type: String,
    maxLength: 150,
    required: true,
  },
  description: {
    type: String,
    maxLength: 1000,
    required: true,
  },

  chat: [
    {
      requestor: {
        type: String,
        maxLength: 50,
        required: true,
        default: "",
      },
      message: {
        type: String,
        maxLength: 1000,
        required: true,
        default: "",
      },
      msgTimeStamp: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    }
  ]
});

module.exports = {
  TicketSchema: mongoose.model("Ticket", TicketSchema),
};
