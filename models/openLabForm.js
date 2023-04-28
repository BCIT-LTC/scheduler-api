const db = require("./index")

const dataForm = {
    findMonth: (month) => {
        let sql = `SELECT * FROM calendar WHERE MONTH(date) = '${month}'`;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                console.log("error and results", err, results);
                if (err) {
                    return reject(err)
                } else {
                    return resolve(results);
                }
            })
        })
    },
    updateCalendar: (forms) => {
        const queryArray = forms.map((form) => {
            return `INSERT INTO calendar VALUES (null, '${form.date}', '${form["start-time"]}', '${form["end-time"]}', '${form["facilitator"]}', '${form["room"]}', '${form["stat"]}' )`})
        return Promise.all(queryArray.map((sql) => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, results) => {
                    console.log("error ANND results", err, results);
                    if (err) return reject(err);
    
                    if (results.length !== 0) {
                        return resolve(results);
                    }
                    reject(new Error(`Couldn't find month: '${month}'`));
                })
            })
        })).then((responseArr) => {
            console.log("response array", responseArr)
            return responseArr
        })
    },
    updateOpenLabDay: (form) => {
        let sql = `UPDATE calendar SET date = '${form.date.replace(/T/, ' ').replace(/Z/, '000')}', \`start-time\`= '${form["start-time"]}', \`end-time\` = '${form["end-time"]}', facilitator = '${form["facilitator"]}', room = '${form["room"]}', stat = '${form["stat"]}' WHERE calendar_id = ${form.calendar_id} `;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                console.log("error and results", err, results);
                if (err) {
                    return reject(err)
                } else {
                    return resolve(results);
                }
            })
        })
    }
}

module.exports = dataForm;