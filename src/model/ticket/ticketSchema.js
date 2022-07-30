const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TicketSchema = new Schema({
  requestorId: {
    type: Schema.Types.ObjectId
  },
  createdDate: {
    type: Date,
    required: true,
    default: function(){return Date.now()},
  },
  status: {
    type: String,
    maxLength: 20,
    required: true,
    default: "Open",
  },
  priority: {
    type: String,
    maxLength: 1,
    required: true,
    default: "2",
  },
  requestor: {
    type: String,
    maxLength: 100,
    // required: true,
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
      sender: {
        type: String,
        maxLength: 50,
      },
      message: {
        type: String,
        maxLength: 1000,
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
