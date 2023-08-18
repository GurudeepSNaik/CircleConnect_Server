const executeQuery = require("./executeQuery");
const notify = require("./notify");

const notifyWorkerForJob = async (jobId) => {
  try {
    const query = `select * from job where jobId=${jobId}`;
    const job = await executeQuery(query);
    const category = job[0].category;
    // const query2 = `SELECT u.fmctoken, u.name
    //               FROM user u
    //               JOIN experience e ON u.userId = e.userId
    //               WHERE e.industry = ${category};`;
    const query2 = `SELECT fmctoken, name FROM user WHERE type = "worker";`;

    const fmctokens = await executeQuery(query2);
    const users =fmctokens?.map((each) => ({ token: each.fmctoken, name: each.name })) || [];
    const notificationPromises = users.map((element) => {
      return notify(
        element.token,
        `Hello ${element.name}`,
        "new job has been posted which matches your experience"
      );
    });

    const result = await Promise.all(notificationPromises);
    console.log(result);
  } catch (error) {
    console.log("Error:", error);
  }
};
// notifyUser();

module.exports = {
  notifyWorkerForJob,
};
