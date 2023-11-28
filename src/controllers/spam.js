const connection = require("../../config/connection.js");
module.exports = {
  addSpamComments: async (req, res) => {
    const { spamText, spammer_id, recipient_id } = req.body;

    if (!spamText || !spammer_id || !recipient_id) {
      return res.status(201).json({
        status: 0,
        message: "All fields are required",
      });
    }

    const query = `INSERT INTO spam(spamText,spammer_id,recipient_id) VALUES("${spamText}","${spammer_id}","${recipient_id}")`;

    connection.query(query, (err, result) => {
      if (err) {
        return res.status(201).json({
          status: 0,
          message: err.message,
        });
      }

      return res.status(200).json({
        status: 1,
        message: "Spam comment added successfully",
      });
    });
  },

  getSpamUserList: async (req, res) => {
    const query = `
    SELECT 
    s.*, 
    JSON_OBJECT(
        'name', u.name,
        'email', u.email,
        'type', u.type,
        'mobile', u.mobile
    ) AS spammerData,
    JSON_OBJECT(
        'name', u2.name,
        'email', u2.email,
        'type', u2.type,
        'mobile', u2.mobile
    ) AS recipientData
FROM 
    spam s
LEFT JOIN 
    user u ON s.spammer_id = u.userId
LEFT JOIN 
    user u2 ON s.recipient_id = u2.userId;

    `;
    connection.query(query, (err, result) => {
      if (err) {
        return res.status(201).json({
          status: 0,
          message: err.message,
        });
      }
      const parsedData = result.map((spam) => ({
        ...spam,
        spammerData : JSON.parse(spam.spammerData),
        recipientData : JSON.parse(spam.recipientData)
      }))
      return res.status(200).json({
        status: 1,
        message: "spammer list retrieved successfully!",
        list: parsedData,
      });
    });
  },
};
