const db = require("./index");

const saveLogoutTime = (email, logoutTime) => {
    let sql = `UPDATE users SET logoutTime='${logoutTime}' WHERE email=${email}`;
    
    return new Promise((resolve, reject) => {
        db.query(sql, (error, results) => {
            if (error) return reject(error);
        })
    })
}

const logoutTime = (email) => {
    let sql = `SELECT logoutTime FROM users WHERE email=${email}`;

    return new Promise((resolve, reject) => {
        db.query(sql, (error, results) => {
            if (error) return reject(error);

            return resolve(results);
        })
    })
}

module.exports = { saveLogoutTime, logoutTime };