const executeQuery = require("./executeQuery");
const notify = require("./notify");
const queries = require("./queries");

const notifyWorkerForJob = async (jobId) => {
  try {
    const query = `select * from job where jobId=${jobId}`;
    const job = await executeQuery(query);
    const category = job[0].category;
    // const query2 = `SELECT u.fmctoken, u.name u.userId
    //               FROM user u
    //               JOIN experience e ON u.userId = e.userId
    //               WHERE e.industry = ${category};`;
    const query2 = `SELECT fmctoken, name, userId FROM user WHERE type = "worker";`;

    const fmctokens = await executeQuery(query2);
    const users =fmctokens?.map((each) => ({ token: each.fmctoken, name: each.name,userId:each.userId })) || [];
    const notificationPromises = users.map((element) => {
      return notify(
        element.token,
        `Hello ${element.name}`,
        // "new job has been posted which matches your experience"
        "new job has been posted",
        element.userId
      );
    });

    const result = await Promise.all(notificationPromises);
    console.log(result);
  } catch (error) {
    console.log("Error:", error);
  }
};
const notifyCompanyForApplication = async (jobId, userId) => {
  try {
    const query = `select name from user where userId=${userId}`;
    const worker = await executeQuery(query);
    const workername = worker[0].name;
    const query2 = `SELECT u.name, u.fmctoken , u.userId
                  FROM user u
                  JOIN job j ON u.userId = j.userId
                  WHERE j.jobId = ${jobId};`;

    const fmctokens = await executeQuery(query2);
    const user = {
      token: fmctokens[0].fmctoken,
      name: fmctokens[0].name,
      userId:fmctokens[0].userId
    };
    const result = await notify(
      user.token,
      `Hello ${user.name}`,
      `${workername} has applied for a job`,
      user.userId
    );
    console.log(result);
  } catch (error) {
    console.log("Error:", error);
  }
};
const notifyApplicantForJobAcceptence = async (applicationId) => {
  try {
    const query = `select applicationuserId,applicationjobId from application where id=${applicationId}`;
    const application = await executeQuery(query);
    const userId = application[0].applicationuserId;
    const jobId = application[0].applicationjobId;
    const query2 = `select companyName from job where jobId=${jobId}`;
    const companyNameResult = await executeQuery(query2);
    const query3 = `select fmctoken,name from user where userId=${userId};`;
    const usernameandtoken = await executeQuery(query3);
    const username = usernameandtoken[0].name;
    const token = usernameandtoken[0].fmctoken;
    const companyName=companyNameResult[0].companyName
    const result = await notify(
      token,
      `Hello ${username}`,
      `congratulations your application was accepted in ${companyName}.`,
      userId
    );
    console.log(result);
  } catch (error) {
    console.log("Error:", error);
  }
};

module.exports = {
  notifyWorkerForJob,
  notifyCompanyForApplication,
  notifyApplicantForJobAcceptence,
};
