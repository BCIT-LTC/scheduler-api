const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = {
    findOne: (email) => {
        return prisma.user.findUnique({
            where: { email },
        });
    },
    findById: (id) => {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    // findOne: (email) => {
    //     let sql = `SELECT * FROM users WHERE email='${email}'`;

    //     return new Promise((resolve, reject) => {
    //         db.query(sql, (error, results) => {
    //             if (error) return reject(error);

    //             if (results.length !== 0 && results[0].email === email) {
    //                 return resolve(results[0]);
    //             }
    //             reject(new Error(`Couldn't find user with email: '${email}'`));
    //         });
    //     });
    // },
    // findById: (id) => {
    //     let sql = `SELECT * FROM users WHERE userid=${id}`;

    //     return new Promise((resolve, reject) => {
    //         db.query(sql, (error, results) => {
    //             if (error) return reject(error);

    //             if (results[0].userid === id) {
    //                 return resolve(results[0]);
    //             }
    //             reject(new Error(`Couldn't find user with id: ${id}`));
    //         });
    //     });
    // },
};

// const addUser = (email, password) => {
//     let sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
//     return new Promise((resolve, reject) => {
//         db.query(sql, (error, results) => {
//             if (error) {
//                 console.log("Error: " + error);
//                 return reject(error);
//             } else {
//                 console.log("User added successfully");
//                 resolve(results);
//             }
//         });
//     });
// };

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

module.exports = { prisma, userModel };
