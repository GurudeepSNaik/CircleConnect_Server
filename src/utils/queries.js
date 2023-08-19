module.exports = {
  ALL_APPLICATIONS_QUERY:()=>(`SELECT * FROM application`),
  ALL_EXPERIENCE_QUERY: ()=>(`SELECT * FROM experience`),
  ALL_JOBS_QUERY:()=>( `SELECT * FROM job`),
  ALL_PROFILE_QUERY:()=>( `SELECT * FROM profile`),
  ALL_QUALIFICATIONS_QUERY: ()=>(`SELECT * FROM qualification`),
  ALL_SETTINGS_QUERY: ()=>(`SELECT * FROM settings`),
  ALL_USERS_QUERY: ()=>(`SELECT * FROM user`),
  DATA_WITH_KEY_VALUE_TABLE:(key,value,table)=>(`SELECT * FROM ${table} WHERE ${key}=${value}`),
  COUNT_WITH_KEY_VALUE_TABLE:(key,value,table)=>(`SELECT COUNT(*) AS count FROM ${table} WHERE ${key} = ${value};`),
  GET_APPLICATIONS_WITH_SORTBY_SORTORDER_LENGTH_SKIP:(sortBy,sortOrder,length,skip,search=false)=>(`
    SELECT 
    application.id AS applicationId,
    application.coverletter,
    application.applicationjobId,
    application.applicationuserId,
    application.applicationownerId,
    application.rejected,
    application.accepted,
    application.job_rating,
    application.job_review,
    application.applicant_rating,
    application.applicant_review,
    user.name AS username,
    user.email AS useremail,
    user.type AS usertype,
    user.mobile AS usermobile,
    user.city AS usercity,
    user.province AS userstate,
    user.country AS usercountry,
    job.companyName AS jobcompanyname,
    job.location AS joblocation,
    job.dressCode AS jobdresscode,
    job.noa AS jobnumberofapplicants,
    job.fixedCost AS jobfixedcost,
    job.variableCost AS jobvariablecost,
    job.tnc AS jobtermsandconditions,
    job.requiredSkill AS jobrequiredskill,
    job.minExp AS jobminexp,
    job.jobType AS jobtype,
    job.popular AS jobpopular,
    job.description AS jobdescription,
    job.status AS jobStatus
    FROM application
    JOIN user ON application.applicationuserId = user.userId
    JOIN job ON application.applicationjobId = job.jobId
    WHERE application.rejected != ${1}
    ${search ? 
    `AND (
      job.companyName LIKE '%${search}%'
      OR job.requiredSkill LIKE '%${search}%'
      OR job.jobType LIKE '%${search}%'
      OR job.location LIKE '%${search}%'
      OR user.name LIKE '%${search}%'
      OR user.email LIKE '%${search}%'
      OR user.mobile LIKE '%${search}%'
      OR user.city LIKE '%${search}%'
      OR user.province LIKE '%${search}%'
      OR user.country LIKE '%${search}%'
      OR application.coverletter LIKE '%${search}%'
      OR job.location LIKE '%${search}%'
      OR job.location LIKE '%${search}%'
      )`:""}
    ORDER BY application.${sortBy} ${sortOrder}
    LIMIT ${length} OFFSET ${skip};
  `),
  COUNT_APPLICATION_WHICH_ARE_NOT_REJECTED:()=>(`
  SELECT COUNT(*) AS totalCount
  FROM application
  WHERE application.rejected != ${1}
  ;
`),
CREATE_EMPTY_PROFILE_WITH_USERID:(userId)=>(`INSERT INTO profile (userId, createdAt, updatedAt, status)
VALUES (${userId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);
`),
CREATE_EMPTY_QUALIFICATION_WITH_USERID:(userId)=>(`INSERT IGNORE INTO qualification (userId, createdAt, updatedAt, status)
SELECT ${userId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM qualification WHERE userId = ${userId});`),
CREATE_EMPTY_EXPERIENCE_WITH_USERID:(userId)=>(`INSERT IGNORE INTO experience (userId, createdAt, updatedAt, status)
SELECT ${userId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM experience WHERE userId = ${userId});`),
GET_RECENT_APPLICANT_WITH_OWNER_ID:(userId,length, skip, sortBy,sortOrder)=>( `
SELECT 
application.id AS applicationId,
application.coverletter,
application.applicationjobId,
application.applicationuserId,
application.applicationownerId,
user.name AS username,
user.email AS useremail,
user.type AS usertype,
user.mobile AS usermobile,
user.city AS usercity,
user.province AS userstate,
user.country AS usercountry,
job.companyName AS jobcompanyname,
job.location AS joblocation,
job.dressCode AS jobdresscode,
job.noa AS jobnumberofapplicants,
job.fixedCost AS jobfixedcost,
job.variableCost AS jobvariablecost,
job.tnc AS jobtermsandconditions,
job.requiredSkill AS jobrequiredskill,
job.minExp AS jobminexp,
job.jobType AS jobtype,
job.popular AS jobpopular,
job.description AS jobdescription
FROM application
JOIN user ON application.applicationuserId = user.userId
JOIN job ON application.applicationjobId = job.jobId
WHERE application.applicationownerId = ${userId}
AND application.rejected = 0
AND application.accepted = 0
ORDER BY application.${sortBy} ${sortOrder}
LIMIT ${length} OFFSET ${skip};
`),
COUNT_RECENT_APPLICANT_WITH_OWNER_ID:(userId)=>(`
SELECT COUNT(*) AS totalCount
FROM application
WHERE application.applicationownerId = ${userId}
AND application.rejected = 0
AND application.accepted = 0;
`),
LOG_OUT_WHITH_ID:(id)=>(`UPDATE user SET logged = false WHERE userId = '${id}';`),
ADD_NOTIFICATIONS:(title, body, token, userId, jobId = null, applicationId = null)=> {
  const columns = ['title', 'body', 'token', 'userId'];
  const values = [title, body, token, userId];
  if (jobId !== null) {
      columns.push('jobId');
      values.push(jobId);
  }

  if (applicationId !== null) {
      columns.push('applicationId');
      values.push(applicationId);
  }

  const columnsString = columns.join(', ');
  const valuesString = values.map(value => typeof value === 'string' ? `'${value}'` : value).join(', ');

  const query = `INSERT INTO notifications (${columnsString}) VALUES (${valuesString});`;
  return query;
},
GET_NOTIFICATIONS:(userId)=>(`SELECT 
n.id AS notification_id, 
n.title AS notification_title, 
n.body AS notification_body, 
u.userId AS user_userId, 
u.name AS user_name, 
u.email AS user_email, 
u.type AS user_type, 
u.mobile AS user_mobile, 
p.profileId AS profile_profileId, 
p.fullName AS profile_fullName, 
p.profilePic AS profile_profilePic, 
p.companyname AS profile_companyname, 
j.jobId AS job_jobId,
j.category AS job_category,
j.companyName AS job_companyName,
j.location AS job_location,
j.dressCode AS job_dressCode,
j.dateAndTime AS job_dateAndTime,
j.noa AS job_noa,
j.fixedCost AS job_fixedCost,
j.variableCost AS job_variableCost,
j.tnc AS job_tnc,
j.requiredSkill AS job_requiredSkill,
j.minExp AS job_minExp,
j.jobType AS job_jobType,
j.popular AS job_popular,
j.description AS job_description,
j.job_complete AS job_job_complete,
j.companyImage AS job_companyImage,
a.coverletter AS application_coverletter,
a.applicationjobId AS application_applicationjobId,
a.applicationuserId AS application_applicationuserId,
a.applicationownerId AS application_applicationownerId,
a.rejected AS application_rejected,
a.accepted AS application_accepted,
a.job_rating AS application_job_rating,
a.job_review AS application_job_review,
a.applicant_rating AS application_applicant_rating,
a.applicant_review AS application_applicant_review,
a.job_complete AS application_job_complete
FROM 
notifications n
LEFT JOIN 
user u ON n.userId = u.userId
LEFT JOIN 
profile p ON n.userId = p.userId
LEFT JOIN 
job j ON n.jobId = j.jobId
LEFT JOIN 
application a ON n.applicationId = a.id
WHERE 
n.userId = ${userId};
`),
DELETE_NOTIFICATIONS:(id)=>(`DELETE FROM notifications WHERE id = ${id};`)
};
