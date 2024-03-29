const connection = require("../../config/connection");
const updatetablesinDatabase = () => {
  const checkColumnsQuery = `SHOW COLUMNS FROM application LIKE 'job_rating';`;
  connection.query(checkColumnsQuery, (columnsErr, columnsResult) => {
    if (columnsErr) console.log(columnsErr);
    if (columnsResult.length === 0) {
      const addRatingColumnQuery = `ALTER TABLE application ADD job_rating INT(1) UNSIGNED;`;
      connection.query(
        addRatingColumnQuery,
        (addRatingErr, addRatingResult) => {
          if (addRatingErr) console.log(addRatingErr);
        }
      );
    }
  });

  const checkReviewColumnQuery = `SHOW COLUMNS FROM application LIKE 'job_review';`;
  connection.query(checkReviewColumnQuery, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE application ADD job_review VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const checkapplicantrating = `SHOW COLUMNS FROM application LIKE 'applicant_rating';`;
  connection.query(checkapplicantrating, (columnsErr, columnsResult) => {
    if (columnsErr) console.log(columnsErr);
    if (columnsResult.length === 0) {
      const addRatingColumnQuery = `ALTER TABLE application ADD applicant_rating INT(1) UNSIGNED;`;
      connection.query(
        addRatingColumnQuery,
        (addRatingErr, addRatingResult) => {
          if (addRatingErr) console.log(addRatingErr);
        }
      );
    }
  });

  const checkapplicantreview = `SHOW COLUMNS FROM application LIKE 'applicant_review';`;
  connection.query(checkapplicantreview, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE application ADD applicant_review VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_companyname_profile = `SHOW COLUMNS FROM profile LIKE 'companyname';`;
  connection.query(check_companyname_profile, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE profile ADD companyname VARCHAR(100);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_settings_table = `SHOW TABLES LIKE 'settings';`;
  connection.query(check_settings_table, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `CREATE TABLE settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          location BOOLEAN,
          notifications BOOLEAN,
          userId INT UNIQUE,
          FOREIGN KEY (userId) REFERENCES user(userId)
      );`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_complete_In_Application = `SHOW COLUMNS FROM application LIKE 'job_complete';`;
  connection.query(check_complete_In_Application, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE application ADD job_complete BOOLEAN DEFAULT false;`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_complete_In_Job = `SHOW COLUMNS FROM job LIKE 'job_complete';`;
  connection.query(check_complete_In_Job, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE job ADD job_complete BOOLEAN DEFAULT false;`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_logged_In_user = `SHOW COLUMNS FROM user LIKE 'logged';`;
  connection.query(check_logged_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD logged BOOLEAN DEFAULT false;`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_fmctoken_In_user = `SHOW COLUMNS FROM user LIKE 'fmctoken';`;
  connection.query(check_fmctoken_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD fmctoken VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_firebaseId_In_user = `SHOW COLUMNS FROM user LIKE 'firebaseId';`;
  connection.query(check_firebaseId_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD firebaseId VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_registrationNumber_In_user = `SHOW COLUMNS FROM user LIKE 'registrationNumber';`;
  connection.query(
    check_registrationNumber_In_user,
    (reviewErr, reviewResult) => {
      if (reviewErr) console.log(reviewErr);
      if (reviewResult.length === 0) {
        const addReviewColumnQuery = `ALTER TABLE user ADD registrationNumber VARCHAR(1000);`;
        connection.query(
          addReviewColumnQuery,
          (addReviewErr, addReviewResult) => {
            if (addReviewErr) console.log(addReviewErr);
          }
        );
      }
    }
  );

  const check_govtPhoto_In_user = `SHOW COLUMNS FROM user LIKE 'govtPhoto';`;
  connection.query(check_govtPhoto_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD govtPhoto VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_govtPhotoStatus_In_user = `SHOW COLUMNS FROM user LIKE 'govtPhotoStatus';`;
  connection.query(check_govtPhotoStatus_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD govtPhotoStatus BOOLEAN default false;`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_addressLine1_In_user = `SHOW COLUMNS FROM user LIKE 'addressLine1';`;
  connection.query(check_addressLine1_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD addressLine1 VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_addressLine2_In_user = `SHOW COLUMNS FROM user LIKE 'addressLine2';`;
  connection.query(check_addressLine2_In_user, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE user ADD addressLine2 VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_image_In_industry = `SHOW COLUMNS FROM industry LIKE 'image';`;
  connection.query(check_image_In_industry, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE industry ADD image VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_image_In_job = `SHOW COLUMNS FROM job LIKE 'companyImage';`;
  connection.query(check_image_In_job, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE job ADD companyImage VARCHAR(1000);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_notifications_table = `SHOW TABLES LIKE 'notifications';`;
  connection.query(check_notifications_table, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `CREATE TABLE notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(1000),
          body VARCHAR(1000),
          token VARCHAR(1000),
          userId INT,
          FOREIGN KEY (userId) REFERENCES user(userId)
      );`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });

  const check_applicationId_job = `SHOW COLUMNS FROM notifications LIKE 'applicationId';`;
  connection.query(check_applicationId_job, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE notifications 
        ADD applicationId INT,
        ADD COLUMN jobId INT,
        ADD FOREIGN KEY (applicationId) REFERENCES application(id),
        ADD FOREIGN KEY (jobId) REFERENCES job(jobId);`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_spam_table = `SHOW TABLES LIKE 'spam'`;
  connection.query(check_spam_table, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `CREATE TABLE spam (
        spamText VARCHAR(1000),
        spammer_id INT UNIQUE,
        recipient_id INT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (spammer_id) REFERENCES user(userId),
        FOREIGN KEY (recipient_id) REFERENCES user(userId)
    );`;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
  const check_spamText_spam = `SHOW COLUMNS FROM spam LIKE 'spamText';`;
  connection.query(check_spamText_spam, (reviewErr, reviewResult) => {
    if (reviewErr) console.log(reviewErr);
    if (reviewResult.length === 0) {
      const addReviewColumnQuery = `ALTER TABLE spam 
        ADD spamText VARCHAR(1000),
        ADD spammer_id INI UNIQUE,
        ADD recipient_id INT UNIQUE,
        ADD created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ADD updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        FOREIGN KEY (spammer_id) REFERENCES user(userId),
        FOREIGN KEY (recipient_id) REFERENCES user(userId)
        ;
        `;
      connection.query(
        addReviewColumnQuery,
        (addReviewErr, addReviewResult) => {
          if (addReviewErr) console.log(addReviewErr);
        }
      );
    }
  });
};
module.exports = updatetablesinDatabase;
