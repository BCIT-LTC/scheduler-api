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
  database: MYSQL_DB
});

db.connect(function(err) {
  if (err) {
      throw err;
  }
  console.log(" Database Connected");
})


const userModel = {
  findOne: (email) => {
    let sql = `SELECT * FROM users WHERE email='${email}'`;

    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) return reject(error);

        if (results.length !== 0 && results[0].email === email) {
          return resolve(results[0]);
        } 
        reject(new Error(`Couldn't find user with email: '${email}'`));
      })
    })
  },
  findById: (id) => {
    let sql = `SELECT * FROM users WHERE userid=${id}`;

    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) return reject(error);
        
        if (results[0].userid === id) {
          return resolve(results[0]);
        }
        reject(new Error(`Couldn't find user with id: ${id}`));
      })
    })
  },

}

const addUser = (email, password) => {
  let sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results) => {
      if (error) {
        console.log('Error: ' + error)
        return reject(error);
      }
      else {
        console.log('User added successfully')
        resolve(results);
      }
    })
    }
    )

  }

// const addUser = (email, password) => {
//   let sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

//   // return new Promise((resolve, reject) => {
//   //   db.query(sql,  (error, results) =>{
//   //     if (error) return reject(error);
//   //     resolve(results);

//   //   }

//   //   )
//   // })
// }

module.exports = { db, userModel, addUser};


