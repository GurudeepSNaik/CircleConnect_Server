const { getMessaging } = require("firebase-admin/messaging");

process.env.GOOGLE_APPLICATION_CREDENTIALS;
const notify = async (fcmToken, title, body) => {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: fcmToken,
    };

    const response= await getMessaging().send(message);
    return { status: "resolved", message: response };
  } catch (error) {
    return { status: "rejected", message: error.message };
  }
};

module.exports = notify;
