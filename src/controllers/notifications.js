const connection = require("../../config/connection.js");
const executeQuery = require("../utils/executeQuery.js");
const queries = require("../utils/queries.js");

module.exports = {
  get: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(201).json({
          status: 0,
          message: "userId is required in query",
        });
      }
      const query = queries.GET_NOTIFICATIONS(userId);
      const result = await executeQuery(query);
      return res.status(200).json({
        status: 1,
        list: result,
      });
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(201).json({
          status: 0,
          message: "id is required in query (Notification id)",
        });
      }
      const query = queries.DELETE_NOTIFICATIONS(id);
      await executeQuery(query);
      return res.status(200).json({
        status: 1,
        message: "notification deleted Successfully",
      });
    } catch (error) {
      res.status(201).json({
        status: 0,
        message: error.message,
      });
    }
  },
};
