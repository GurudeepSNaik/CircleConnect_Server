const changeKeyNameToObject = (result) => {
  const isArray = Array.isArray(result);
  if (!isArray) {
    return [];
  }

  return result.map((each) => {
    const user = {};
    const profile = {};
    const application = {};
    const job = {};
    const notification = {};
    for (const [key, value] of Object.entries(each)) {
      if (key.startsWith("notification_")) {
        const formattedKey = key.replace("notification_", "");
        notification[formattedKey] = value;
      }else if (key.startsWith("user_")) {
        const formattedKey = key.replace("user_", "");
        user[formattedKey] = value;
      }else if (key.startsWith("profile_")) {
        const formattedKey = key.replace("profile_", "");
        profile[formattedKey] = value;
      }else if (key.startsWith("job_")) {
        const formattedKey = key.replace("job_", "");
        job[formattedKey] = value;
      }else if (key.startsWith("application_")) {
        const formattedKey = key.replace("application_", "");
        application[formattedKey] = value;
      }
    }
    return {
        user,
        profile,
        application,
        job,
        notification
    }
  });
};

module.exports = {
  changeKeyNameToObject,
};
