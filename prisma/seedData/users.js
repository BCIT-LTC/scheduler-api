// This file is used to seed the database with users.
const { Role } = require("@prisma/client");
const superuser = [
    {
        email: process.env.SAML_SUPERUSER,
        first_name: "Super",
        last_name: "User",
        saml_role: "unregistered",
        app_roles: [Role.admin],
        department: "LTC",
        is_active: true,
        created_at: new Date(),
    }
]
const dev_users = [
    {
        email: process.env.SAML_SUPERUSER,
        first_name: "DEV",
        last_name: "SuperUser2",
        saml_role: "unregistered",
        app_roles: [Role.admin],
        department: "LTC",
        is_active: true,
        created_at: "2017-06-01T08:30:00",
    },
    {
        email: "employee_one@bcit.ca",
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
        first_name: "Nurs",
        last_name: "Dent",
        saml_role: "student",
        app_roles: [Role.student],
        department: "Nursing",
        is_active: true,
        created_at: "2021-06-01T09:50:05",
    },
];

module.exports = { dev_users, superuser };
