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
`)
};
