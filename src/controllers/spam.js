const connection = require("../../config/connection.js");
module.exports = {
  addSpamComments: (req, res) => {
    const { spamText, spammer_name, recipient_name } = req.body;

    if (!spamText || !spammer_name || !recipient_name) {
      return res.status(201).json({
        status: 0,
        message: "All fields are required",
      });
    }

    const query = `INSERT INTO spam(spamText,spammer_name,recipient_name) VALUES("${spamText}","${spammer_name}","${recipient_name}")`;

    connection.query(query, (err, result) => {
      if (err) {
        return res.status(201).json({
          status: 0,
          message:err.message,
        });
      }

      return res.status(200).json({
        status: 1,
        message: "Spam comment added successfully",
      });
    });
  },

  getSpamUserList:(req,res) => {
    const query = `SELECT spamText,spammer_name,recipient_name FROM spam`;

    connection.query(query,(err,result) => {
      if(err){
        return res.status(201).json({
          status: 0,
          message:err.message,
        })
      }

      return res.status(200).json({
        status: 1,
          message:"spammer list retrieved successfully!",
          list:result
      })
    })
  }
};
