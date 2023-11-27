const connection = require("../../config/connection.js");
module.exports = {
  addSpamComments: (req, res) => {
    const { spamText } = req.body;

    if (!spamText) {
      return res.status(201).json({
        status: 0,
        message: "All fields are required",
      });
    }

    const query = `INSERT INTO spam VALUES("${spamText}")`;

    connection.query(query, (err, result) => {
      if (err) {
        return res.status(201).json({
          status: 0,
          message: "All fields are required",
        });
      }

      return res.status(200).json({
        status: 1,
        message: "Spam comment added successfully",
      });
    });
  },
};
