const connection = require("../../config/connection");
const updatetablesinDatabase=()=>{
    const checkColumnsQuery = `SHOW COLUMNS FROM application LIKE 'job_rating';`;
    connection.query(checkColumnsQuery, (columnsErr, columnsResult) => {
      if (columnsErr)console.log(columnsErr);
      if (columnsResult.length === 0) {
        const addRatingColumnQuery = `ALTER TABLE application ADD job_rating INT(1) UNSIGNED;`;
        connection.query(addRatingColumnQuery, (addRatingErr, addRatingResult) => {
          if (addRatingErr) console.log(addRatingErr);
        });
      }
    });


    const checkReviewColumnQuery = `SHOW COLUMNS FROM application LIKE 'job_review';`;
    connection.query(checkReviewColumnQuery, (reviewErr, reviewResult) => {
      if (reviewErr)  console.log(reviewErr);    
      if (reviewResult.length === 0) {
        const addReviewColumnQuery = `ALTER TABLE application ADD job_review VARCHAR(1000);`;
        connection.query(addReviewColumnQuery, (addReviewErr, addReviewResult) => {
          if (addReviewErr)  console.log(addReviewErr);
        });
      }
    });


    const checkapplicantrating = `SHOW COLUMNS FROM application LIKE 'applicant_rating';`;
    connection.query(checkapplicantrating, (columnsErr, columnsResult) => {
      if (columnsErr)console.log(columnsErr);
      if (columnsResult.length === 0) {
        const addRatingColumnQuery = `ALTER TABLE application ADD applicant_rating INT(1) UNSIGNED;`;
        connection.query(addRatingColumnQuery, (addRatingErr, addRatingResult) => {
          if (addRatingErr) console.log(addRatingErr);
        });
      }
    });


    const checkapplicantreview = `SHOW COLUMNS FROM application LIKE 'applicant_review';`;
    connection.query(checkapplicantreview, (reviewErr, reviewResult) => {
      if (reviewErr)  console.log(reviewErr);    
      if (reviewResult.length === 0) {
        const addReviewColumnQuery = `ALTER TABLE application ADD applicant_review VARCHAR(1000);`;
        connection.query(addReviewColumnQuery, (addReviewErr, addReviewResult) => {
          if (addReviewErr)  console.log(addReviewErr);
        });
      }
    });

    const check_companyname_profile = `SHOW COLUMNS FROM profile LIKE 'companyname';`;
    connection.query(check_companyname_profile, (reviewErr, reviewResult) => {
      if (reviewErr)  console.log(reviewErr);    
      if (reviewResult.length === 0) {
        const addReviewColumnQuery = `ALTER TABLE profile ADD companyname VARCHAR(100);`;
        connection.query(addReviewColumnQuery, (addReviewErr, addReviewResult) => {
          if (addReviewErr)  console.log(addReviewErr);
        });
      }
    });

    const check_settings_table = `SHOW TABLES LIKE 'settings';`;
    connection.query(check_settings_table, (reviewErr, reviewResult) => {
      if (reviewErr)  console.log(reviewErr);    
      if (reviewResult.length === 0) {
        const addReviewColumnQuery = `CREATE TABLE settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          location BOOLEAN,
          notifications BOOLEAN,
          userId INT UNIQUE,
          FOREIGN KEY (userId) REFERENCES user(userId)
      );`;
        connection.query(addReviewColumnQuery, (addReviewErr, addReviewResult) => {
          if (addReviewErr)  console.log(addReviewErr);
        });
      }
    });
}
module.exports=updatetablesinDatabase;