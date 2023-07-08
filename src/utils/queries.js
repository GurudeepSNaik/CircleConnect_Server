module.exports = {
  ALL_APPLICATIONS_QUERY: `SELECT * FROM application`,
  ALL_EXPERIENCE_QUERY: `SELECT * FROM experience`,
  ALL_JOBS_QUERY: `SELECT * FROM job`,
  ALL_PROFILE_QUERY: `SELECT * FROM profile`,
  ALL_QUALIFICATIONS_QUERY: `SELECT * FROM qualification`,
  ALL_SETTINGS_QUERY: `SELECT * FROM settings`,
  ALL_USERS_QUERY: `SELECT * FROM user`,
  DATA_WITH_KEY_VALUE_TABLE:(key,value,table)=>(`SELECT * FROM ${table} WHERE ${key}=${value}`),
  COUNT_WITH_KEY_VALUE_TABLE:(key,value,table)=>(`SELECT COUNT(*) AS count FROM ${table} WHERE ${key} = ${value};`)
};
