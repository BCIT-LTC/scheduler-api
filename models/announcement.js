const mysql = require("mysql2");
require("dotenv").config();
const MYSQL_DB = process.env.MYSQL_DB;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

const db = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
});

db.connect(function (err) {
  if (err) {
    throw err;
  }
});

//retrieve announcements for announcement table
const getAnnouncement = () => {
  let sql = `SELECT * FROM announcements`;

  return new Promise((resolve, reject) => {
    db.query(sql, (error, results) => {
      if (error) return reject(error);

      return resolve(results);
    });
  });
};

//add announcements to MySQL database
const addAnnouncement = (title, description, date) => {
  let sql = `INSERT INTO announcements (title, description, date) VALUES ('${title}', '${description}', '${date}')`;
  db.query(sql, (error, results, fields) => {
    if (error) throw error;
    console.log(results);
  });
  res.status(200).send(title, description, date);
};

//delete announcements from MySQL database
const deleteAnnouncement = (id) => {
  let sql = `DELETE FROM announcements WHERE announcements_id = '${id}';`;

  return new Promise((resolve, reject) => {
    db.query(sql, (error, results) => {
      if (error) return reject(error);

      console.log("Deleted Row(s):", results.affectedRows);
      return resolve(results);
    });
  });
};

module.exports = {
  getAnnouncement,
  addAnnouncement,
  deleteAnnouncement,
};
