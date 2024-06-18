// This file is used to seed the database with users.
const { Role } = require("@prisma/client");
const users = [
    {
        email: process.env.SUPERUSER,
        user_id: 1,
        first_name: "Ad",
        last_name: "Min",
        saml_role: Role.admin,
        app_roles: [Role.admin],
        department: "LTC",
        is_active: true,
        created_at: "2017-06-01T08:30:00",
    },
    {
        email: "employee_one@bcit.ca",
        user_id: 2,
        first_name: "Emma",
        last_name: "Onesie",
        saml_role: "employee",
        app_roles: [Role.employee],
        department: "Student Services",
        is_active: true,
        created_at: "2019-06-01T09:00:00",
    },
    {
        email: "nursing_student@bcit.ca",
        user_id: 3,
        first_name: "Nurs",
        last_name: "Dent",
        saml_role: "student",
        app_roles: [Role.student],
        department: "Nursing",
        is_active: true,
        created_at: "2021-06-01T09:50:05",
    },
];

module.exports = users;
