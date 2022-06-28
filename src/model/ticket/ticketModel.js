const { TicketSchema } = require("./ticketSchema");

const insertNewTicket = (ticketObj) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema(ticketObj)
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const getTickets = (requestorId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema
        .find({ requestorId })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const getTicketsById = (_id, requestorId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema
        .find({ _id, requestorId })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertNewTicket,
  getTickets,
  getTicketsById,
};
