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
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = notify;
