const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const MYSQL_DB = process.env.MYSQL_DB;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

/*
userid, email, password need to be changed to user's
input when implementing register.
*/

const password = "jace123!"

const encryption = (password) => {
    
    bcrypt
        .genSalt(10)
        .then(salt => {
            return bcrypt.hash(password, salt)
        })
        .then(hash => {
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
                console.log("Connected");
            })
            
            //change userid, email, password to test
            //let sql = `INSERT INTO users (email, password) VALUES ('jace@gmail.com', '${hash}')`;
            let sql = `SELECT * FROM users WHERE email='jace@gmail.com'`;
            
            db.query(sql, (error, results, fields) => {
                if (error) {
                    throw error;
                }
                console.log(results);
            })
            
            db.end();
        })
        /*
        .then(hash => {
            validate(hash)
        })
        */
        .catch(err => console.error(err.message))
    
    const validate = (hash) => {
        bcrypt
            .compare(password, hash)
            .then(res => {
                return res
            })
            .catch(err => console.error(err.message))
    }
}
encryption(password)

//export default encryption;