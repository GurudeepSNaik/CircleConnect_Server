const { getMessaging } = require("firebase-admin/messaging");
const queries = require("./queries");
const executeQuery = require("./executeQuery");

process.env.GOOGLE_APPLICATION_CREDENTIALS;
const notify = async (fcmToken, title, body,userId,jobId,applicationId) => {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: fcmToken,
    };
    const query=queries.ADD_NOTIFICATIONS(title,body,fcmToken,userId,jobId,applicationId);
    executeQuery(query);
    const response= await getMessaging().send(message);
    return { status: "resolved", message: response };
  } catch (error) {
    return { status: "rejected", message: error.message };
  }
};

module.exports = notify;
